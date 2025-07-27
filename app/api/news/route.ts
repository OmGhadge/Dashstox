import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const category = searchParams.get('category') || 'general';
    const API_KEY = process.env.NEXT_PUBLIC_FINNHUB_API_KEY;
    
    if (!API_KEY) {
      return NextResponse.json(
        { error: 'Finnhub API key not configured' },
        { status: 500 }
      );
    }

    const response = await fetch(
      `https://finnhub.io/api/v1/news?category=${category}&token=${API_KEY}`,
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
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
} 