import { NextResponse } from 'next/server';
import Together from 'together-ai';

const together = new Together({ apiKey: process.env.TOGETHER_API_KEY });

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { messages, imageUrl } = body;

    const response = await together.chat.completions.create({
      messages,
      model: 'meta-llama/Llama-Vision-Free',
      max_tokens: 1024,
      temperature: 0.7,
      top_p: 0.7,
      top_k: 50,
      repetition_penalty: 1,
      stop: ['<|eot_id|>', '<|eom_id|>'],
      stream: true
    });

    // Create a ReadableStream to handle the streaming response
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of response) {
            // Serialize the chunk and encode it
            const encodedChunk = new TextEncoder().encode(
              JSON.stringify(chunk) + '\n'
            );
            controller.enqueue(encodedChunk);
          }
        } catch (error) {
          controller.error(error);
        } finally {
          controller.close();
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