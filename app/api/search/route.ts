// app/api/search/route.ts

import { NextResponse } from 'next/server';
import Exa from 'exa-js';

export const dynamic = "force-dynamic"; 

const exa = new Exa(process.env.EXA_API_KEY!);

export async function POST(request: Request) {
    const { query } = await request.json();
    try {
        const results = await exa.search(query); // Adjust method as per Exa documentation
        return NextResponse.json(results);
    } catch (error) {
        console.error("API request error:", error);
        return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
    }
}
