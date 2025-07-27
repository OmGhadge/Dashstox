import { prisma } from '../lib/prisma';
import yahooFinance from 'yahoo-finance2';

async function updateAllStocks() {
  console.log('Starting stock update process...');
  
  try {
    const symbols = await prisma.stockPrice.findMany({
      select: { symbol: true },
      distinct: ['symbol'],
    });
    
    const uniqueSymbols = Array.from(new Set(symbols.map(s => s.symbol as string)));
    console.log(`Found ${uniqueSymbols.length} symbols to update`);
    
    let updatedCount = 0;
    let errorCount = 0;
    
    for (const symbol of uniqueSymbols) {
      try {
        console.log(`Updating ${symbol}...`);
        
        const result = await yahooFinance.historical(symbol as string, {
          period1: '2023-01-01',
          interval: '1d',
        });
        
        if (!result || result.length === 0) {
          console.log(`No data found for ${symbol}`);
          continue;
        }
        
        let symbolUpdatedCount = 0;
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
              lastUpdated: new Date(),
            },
            create: {
              symbol: (symbol as string).toUpperCase(),
              date: day.date,
              open: day.open,
              high: day.high,
              low: day.low,
              close: day.close,
              volume: BigInt(day.volume ?? 0),
              lastUpdated: new Date(),
            },
          });
          symbolUpdatedCount++;
        }
        
        console.log(`Updated ${symbol}: ${symbolUpdatedCount} records`);
        updatedCount += symbolUpdatedCount;
        
      } catch (err) {
        console.error(`Error updating ${symbol}:`, err);
        errorCount++;
      }
    }
    
    console.log(`Stock update completed. Updated: ${updatedCount} records, Errors: ${errorCount}`);
    
  } catch (err) {
    console.error('Error in updateAllStocks:', err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}


updateAllStocks(); 