import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import yahooFinance from 'yahoo-finance2';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ symbol: string }> } 
) {
  const params = await context.params; 
  const symbol = String(params.symbol);
  const { searchParams } = request.nextUrl;
  const interval = searchParams.get('interval') || '1d';

  const validIntervals = ['1m', '2m', '5m', '15m', '30m', '60m', '90m', '1h', '1d', '5d', '1wk', '1mo', '3mo'] as const;
  type IntervalType = typeof validIntervals[number];
  const safeInterval: IntervalType = validIntervals.includes(interval as IntervalType) ? interval as IntervalType : '1d';

  const from = searchParams.get('from');
  const to = searchParams.get('to');

  try {
    
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
      
      const safePrices = prices.map((p: any) => ({ ...p, volume: p.volume.toString() }));
      return NextResponse.json(safePrices);
    }

    
    try {
      let result = await yahooFinance.historical(symbol, { 
        period1: '2023-01-01', 
        interval: safeInterval as any
      });
      
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
        .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()); 

      
      try {
        await prisma.stockPrice.createMany({
          data: formatted,
          skipDuplicates: true, 
        });
      } catch (dbErr) {
        console.error('Error inserting stock prices:', dbErr);
      }

      
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