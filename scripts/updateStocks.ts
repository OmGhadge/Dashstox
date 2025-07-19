import cron from 'node-cron';
import { prisma } from '../lib/prisma';
import yahooFinance from 'yahoo-finance2';

async function updateAllStocks() {
  try {
    const symbols = await prisma.stockPrice.findMany({
      select: { symbol: true },
      distinct: ['symbol'],
    });
    const uniqueSymbols = Array.from(new Set(symbols.map(s => s.symbol as string)));
    for (const symbol of uniqueSymbols) {
      try {
        const result = await yahooFinance.historical(symbol as string, {
          period1: '2023-01-01',
          interval: '1d',
        });
        if (!result || result.length === 0) {
          continue;
        }
        for (const day of result) {
          await prisma.stockPrice.upsert({
            where: {
              symbol_date: {
                symbol: (symbol as string).toUpperCase(),
                date: day.date,
              },
            },
            update: {
              open: day.open,
              high: day.high,
              low: day.low,
              close: day.close,
              volume: BigInt(day.volume ?? 0),
            },
            create: {
              symbol: (symbol as string).toUpperCase(),
              date: day.date,
              open: day.open,
              high: day.high,
              low: day.low,
              close: day.close,
              volume: BigInt(day.volume ?? 0),
            },
          });
        }
      } catch (err) {
        console.error(`Error updating ${symbol}:`, err);
      }
    }
  } catch (err) {
    console.error('Error in updateAllStocks:', err);
  }
}

// Schedule to run every 15 minutes
cron.schedule('*/30 * * * *', updateAllStocks); // Run every 30 minutes

// Run immediately if called directly
if (require.main === module) {
  updateAllStocks();
} 