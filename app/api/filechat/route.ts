import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const generationConfig = {
  temperature: 0.7,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
};

const SYSTEM_PROMPT = `You are a helpful AI assistant. You have access to a document that was uploaded at the start of this conversation. 
Use this document to provide accurate and relevant responses throughout our conversation. 
Even if the user doesn't explicitly mention the document in their follow-up questions, consider the document's content in your responses.`;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { messages } = body;

    // Find the document content from the first message (if it exists)
    const firstMessage = messages[0];
    const documentContent = typeof firstMessage?.content === 'string'
      ? firstMessage.content
      : firstMessage?.content?.find((c: any) => c.text.includes('Document content:'))?.text || '';

    // Extract the text content from the latest message
    const lastMessage = messages[messages.length - 1];
    const latestPrompt = typeof lastMessage.content === 'string'
      ? lastMessage.content
      : lastMessage.content.map((c: any) => c.text).join('\n');

    // Combine system prompt, document context, and user messages
    const fullPrompt = messages.length === 1
      ? latestPrompt // First message already contains document
      : `${SYSTEM_PROMPT}\n\nDocument for reference:\n${documentContent}\n\nUser question: ${latestPrompt}`;

    // Send the message and get response
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
      generationConfig,
    });
    
    const response = await result.response;
    const text = response.text();

    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Format as SSE data
          const data = `data: ${JSON.stringify({ content: text })}\n\n`;
          controller.enqueue(new TextEncoder().encode(data));
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('API route error:', error);
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}