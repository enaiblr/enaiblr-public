import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const language = formData.get('language') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Convert File to Blob
    const arrayBuffer = await file.arrayBuffer();
    const blob = new Blob([arrayBuffer], { type: file.type });
    
    // Create a File object from the Blob
    const audioFile = new File([blob], file.name, {
      type: file.type,
      lastModified: file.lastModified,
    });

    // Initialize Groq client
    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY
    });

    // Create transcription
    const transcription = await groq.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-large-v3",
      temperature: 0.2,
      language: language,
      response_format: "verbose_json",
    });

    return NextResponse.json(transcription);

  } catch (error) {
    console.error('Transcription error:', error);
    return NextResponse.json(
      { error: 'Transcription failed' },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};