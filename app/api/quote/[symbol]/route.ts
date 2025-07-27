import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ symbol: string }> }
) {
  try {
    const params = await context.params;
    const symbol = String(params.symbol);
    const API_KEY = process.env.NEXT_PUBLIC_FINNHUB_API_KEY;
    
    if (!API_KEY) {
      return NextResponse.json(
        { error: 'Finnhub API key not configured' },
        { status: 500 }
      );
    }

    const response = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Finnhub API responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching quote:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quote' },
      { status: 500 }
    );
  }
} 