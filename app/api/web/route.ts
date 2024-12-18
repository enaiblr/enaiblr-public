import { NextResponse } from 'next/server';
import { tavily } from '@tavily/core';

const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { messages } = body;

    // Get the last user message
    const lastMessage = messages[messages.length - 1];
    const query = lastMessage.content[0].text;

    // Perform Tavily search
    const response = await tvly.search(query, {
      searchDepth: "advanced",
      includeAnswer: true,
      maxResults: 5
    });

    // Create a ReadableStream to handle the response
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Send the entire response as a single chunk
          const responseData = {
            query: response.query,
            answer: response.answer || "I couldn't find a specific answer to your question.",
            results: response.results || []
          };
          
          const data = `data: ${JSON.stringify(responseData)}\n\n`;
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
    return NextResponse.json({ error: 'Error processing chat request' }, { status: 500 });
  }
}