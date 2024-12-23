import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { error: 'Invalid URL provided' },
        { status: 400 }
      );
    }

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/pdf,*/*',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': url,
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });

    if (!response.ok) {
      console.error(`Failed to fetch PDF from ${url}: ${response.status} ${response.statusText}`);
      return NextResponse.json(
        { error: `Failed to fetch PDF: ${response.status} ${response.statusText}` },
        { status: response.status }
      );
    }

    const contentType = response.headers.get('content-type');
    // Some servers might not set the correct content-type for PDFs
    if (contentType && !contentType.includes('application/pdf') && !contentType.includes('application/octet-stream')) {
      console.warn('Unexpected content type:', contentType);
    }

    const buffer = await response.arrayBuffer();
    
    // Check if the file starts with the PDF magic number (%PDF-)
    const firstBytes = new Uint8Array(buffer.slice(0, 5));
    const magicNumber = new TextDecoder().decode(firstBytes);
    if (!magicNumber.startsWith('%PDF-')) {
      return NextResponse.json(
        { error: 'The URL does not point to a valid PDF file' },
        { status: 400 }
      );
    }
    
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Length': buffer.byteLength.toString(),
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Error proxying PDF:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch PDF' },
      { status: 500 }
    );
  }
}
