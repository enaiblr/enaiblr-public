import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

export async function POST(req: Request) {
  try {
    const { content } = await req.json();

    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Invalid or empty content provided' },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `Create flashcards from the following text. Each flashcard should have a question on one side and the answer on the other. Format the output as a JSON array of strings, where each string is in the format "Q: [question] A: [answer]". The flashcards should cover the main concepts and key points from the text. Here's the text:

${content}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse the response text as JSON array
    let flashcards: string[];
    try {
      // Try to parse as JSON first
      const parsed = JSON.parse(text);
      flashcards = Array.isArray(parsed) ? parsed : [text];
    } catch (e) {
      // If parsing fails, try to extract Q&A format
      flashcards = text
        .split('\n')
        .filter(line => line.trim().length > 0 && line.includes('Q:') && line.includes('A:'))
        .map(line => line.trim());
      
      if (flashcards.length === 0) {
        // If no Q&A format found, split by numbered items
        flashcards = text
          .split(/\d+\.\s+/)
          .filter(item => item.trim().length > 0)
          .map(item => {
            const parts = item.split('\n').filter(p => p.trim().length > 0);
            if (parts.length >= 2) {
              return `Q: ${parts[0].trim()} A: ${parts.slice(1).join(' ').trim()}`;
            }
            return item.trim();
          });
      }
    }

    if (flashcards.length === 0) {
      return NextResponse.json(
        { error: 'Failed to generate valid flashcards from the content' },
        { status: 500 }
      );
    }

    // Generate hashtags based on the content
    const hashtagPrompt = `Generate 3-5 relevant hashtags for the following content. Return only the hashtags separated by spaces, without the explanation. Each hashtag should start with #:

${content.substring(0, 1000)}`;  // Use first 1000 chars for hashtag generation

    const hashtagResult = await model.generateContent(hashtagPrompt);
    const hashtags = hashtagResult.response.text()
      .split(' ')
      .filter(tag => tag.startsWith('#'));

    return NextResponse.json({
      flashcards,
      hashtags,
    });
  } catch (error) {
    console.error('Error generating flashcards:', error);
    return NextResponse.json(
      { error: 'Failed to generate flashcards' },
      { status: 500 }
    );
  }
}
