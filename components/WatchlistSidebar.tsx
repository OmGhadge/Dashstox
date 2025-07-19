import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface Quote {
  c: number; // current price
  dp: number; // percent change
}

interface WatchlistSidebarProps {
  watchlist: string[];
  onRemove: (symbol: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const API_KEY = process.env.NEXT_PUBLIC_FINNHUB_API_KEY;

const WatchlistSidebar: React.FC<WatchlistSidebarProps> = ({ watchlist, onRemove, isOpen, onToggle }) => {
  const [prices, setPrices] = useState<Record<string, Quote | null>>({});

  useEffect(() => {
    const fetchPrices = async () => {
      const results: Record<string, Quote | null> = {};
      await Promise.all(
        watchlist.map(async (symbol) => {
          try {
            const res = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`);
            if (!res.ok) throw new Error('Failed');
            const data = await res.json();
            results[symbol] = data;
          } catch {
            results[symbol] = null;
          }
        })
      );
      setPrices(results);
    };
    if (watchlist.length > 0) fetchPrices();
  }, [watchlist]);

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="fixed top-20 right-4 z-50 p-2 bg-white border border-gray-200 rounded-md shadow-sm hover:bg-gray-50 transition-colors"
      >
        {isOpen ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>

      {/* Sidebar */}
      {isOpen && (
        <div className="fixed top-16 right-0 w-64 h-[calc(100vh-4rem)] bg-gray-50 border-l border-gray-200 shadow-lg z-40 overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Watchlist</h3>
            </div>
            {watchlist.length === 0 ? (
              <p className="text-gray-500">No stocks added.</p>
            ) : (
              <div className="space-y-2">
                {watchlist.map(symbol => (
                  <div key={symbol} className="flex items-center justify-between bg-white rounded-lg p-3 shadow-sm">
                    <div>
                      <p className="font-semibold text-gray-900">{symbol}</p>
                      <p className={`text-sm ${prices[symbol]?.dp !== undefined && prices[symbol]?.dp >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {prices[symbol] && prices[symbol]?.c !== undefined && prices[symbol]?.dp !== undefined
                          ? `$${prices[symbol]!.c.toFixed(2)} (${prices[symbol]!.dp >= 0 ? '+' : ''}${prices[symbol]!.dp.toFixed(2)}%)`
                          : 'N/A'}
                      </p>
                    </div>
                    <button
                      onClick={() => onRemove(symbol)}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default WatchlistSidebar; 