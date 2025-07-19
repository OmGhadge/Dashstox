import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import yahooFinance from 'yahoo-finance2';

export async function GET(
  request: NextRequest,
  context: { params: { symbol: string } }
) {
  const { symbol } = await context.params;
  const { searchParams } = request.nextUrl;
  const interval = searchParams.get('interval') || '1d';

  const validIntervals = ['1m', '2m', '5m', '15m', '30m', '60m', '90m', '1h', '1d', '5d', '1wk', '1mo', '3mo'] as const;
  type IntervalType = typeof validIntervals[number];
  const safeInterval: IntervalType = validIntervals.includes(interval as IntervalType) ? interval as IntervalType : '1d';

  const from = searchParams.get('from');
  const to = searchParams.get('to');

  try {
    // 1. Try to get from DB
    let prices = await prisma.stockPrice.findMany({
      where: { symbol: symbol.toUpperCase() },
      orderBy: { date: 'desc' },
    });
    if (from || to) {
      prices = prices.filter((p: any) => {
        const d = new Date(p.date);
        const fromOk = from ? d >= new Date(from) : true;
        const toOk = to ? d <= new Date(to) : true;
        return fromOk && toOk;
      });
    }

    if (prices.length > 0) {
      // Convert BigInt volume to string for frontend compatibility
      const safePrices = prices.map((p: any) => ({ ...p, volume: p.volume.toString() }));
      return NextResponse.json(safePrices);
    }

    // 2. If not found, fetch from API
    try {
      let result = await yahooFinance.historical(symbol, { 
        period1: '2023-01-01', 
        interval: safeInterval as any
      });
      // Filter by from/to if provided
      if (from || to) {
        result = result.filter((row: any) => {
          const d = new Date(row.date);
          const fromOk = from ? d >= new Date(from) : true;
          const toOk = to ? d <= new Date(to) : true;
          return fromOk && toOk;
        });
      }

      if (!result || result.length === 0) {
        return NextResponse.json(
          { error: 'Symbol not found or no data available.' },
          { status: 404 }
        );
      }

      const formatted = result
        .map((day: any) => ({
          symbol: symbol.toUpperCase(),
          date: day.date,
          open: day.open,
          high: day.high,
          low: day.low,
          close: day.close,
          volume: BigInt(day.volume ?? 0),
        }))
        .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()); // DESC

      // Store in DB
      try {
        await prisma.stockPrice.createMany({
          data: formatted,
          skipDuplicates: true, // Avoid duplicate entries if concurrent requests
        });
      } catch (dbErr) {
        console.error('Error inserting stock prices:', dbErr);
      }

      // Convert BigInt volume to string for frontend compatibility
      const safeFormatted = formatted.map((p: any) => ({ ...p, volume: p.volume.toString() }));

      return NextResponse.json(safeFormatted);
    } catch (apiErr) {
      return NextResponse.json(
        { 
          error: 'Symbol not found or API error', 
          details: apiErr instanceof Error ? apiErr.message : apiErr 
        },
        { status: 404 }
      );
    }
  } catch (err) {
    console.error('Error fetching stock prices:', err);
    return NextResponse.json(
      { 
        error: 'Failed to fetch stock prices', 
        details: err instanceof Error ? err.message : err 
      },
      { status: 500 }
    );
  }
} 