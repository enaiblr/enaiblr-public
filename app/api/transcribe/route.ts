import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import path from 'path';
import os from 'os';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import { Readable } from 'stream';
import { pipeline } from 'stream/promises';

export async function POST(request: NextRequest) {
  const tmpFilePath = path.join(os.tmpdir(), `${uuidv4()}.wav`);

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

    // Convert File to ArrayBuffer and then to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Create a Node.js Readable stream from the buffer
    const readableStream = Readable.from(buffer);
    const writeStream = fs.createWriteStream(tmpFilePath);

    // Use pipeline to write to file
    await pipeline(readableStream, writeStream);

    // Initialize Groq client
    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY
    });

    // Create transcription using the file path
    const transcription = await groq.audio.transcriptions.create({
      file: fs.createReadStream(tmpFilePath),
      model: "whisper-large-v3",
      temperature: 0.2,
      language: language,
      response_format: "verbose_json",
    });

    // Clean up the temp file
    fs.unlink(tmpFilePath, (err) => {
      if (err) console.error('Error deleting temp file:', err);
    });

    return NextResponse.json(transcription);

  } catch (error: any) {
    // Clean up the temp file in case of error
    fs.unlink(tmpFilePath, (err) => {
      if (err) console.error('Error deleting temp file:', err);
    });

    console.error('Transcription error:', error);
    return NextResponse.json(
      { 
        error: 'Transcription failed', 
        message: error.message || 'Unknown error',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}