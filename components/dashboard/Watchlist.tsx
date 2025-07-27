"use client";

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, X } from 'lucide-react';
import { useWatchlist } from '@/contexts/WatchlistContext';

interface StockQuote {
  c: number; 
  dp: number; 
}

export default function Watchlist() {
  const { watchlist, removeFromWatchlist } = useWatchlist();
  const [prices, setPrices] = useState<Record<string, StockQuote | null>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrices = async () => {
      if (watchlist.length === 0) {
        setLoading(false);
        return;
      }

      const results: Record<string, StockQuote | null> = {};

      await Promise.all(
        watchlist.map(async (symbol) => {
          try {
            const res = await fetch(`/api/quote/${symbol}`);
            if (!res.ok) throw new Error('Failed');
            const data = await res.json();
            results[symbol] = data;
          } catch {
            results[symbol] = null;
          }
        })
      );
      setPrices(results);
      setLoading(false);
    };

    fetchPrices();
  }, [watchlist]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Watchlist</h3>
        </div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-12 bg-gray-200 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Watchlist</h3>
   
      </div>

      <div className="space-y-3">
        {watchlist.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No stocks in watchlist</p>
        ) : (
          watchlist.map((symbol) => {
            const price = prices[symbol];
            const isUp = price?.dp !== undefined && price.dp >= 0;
            
            return (
              <div key={symbol} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                      <p className="font-medium text-gray-900">{symbol}</p>
                      <p className="text-xs text-gray-500 truncate">Stock</p>
                </div>
                <div className="text-right">
                      <p className="font-medium text-gray-900">
                        {price?.c ? `$${price.c.toFixed(2)}` : 'N/A'}
                      </p>
                  <div className="flex items-center space-x-1">
                        {price?.dp !== undefined ? (
                          <>
                            {isUp ? (
                      <TrendingUp className="h-3 w-3 text-green-600" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-600" />
                    )}
                            <p className={`text-xs font-medium ${isUp ? 'text-green-600' : 'text-red-600'}`}>
                              {isUp ? '+' : ''}{price.dp.toFixed(2)}%
                    </p>
                          </>
                        ) : (
                          <p className="text-xs text-gray-500">N/A</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => removeFromWatchlist(symbol)}
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors ml-2"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            );
          })
        )}
      </div>

    
    </div>
  );
}