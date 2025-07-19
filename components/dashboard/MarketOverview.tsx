"use client";

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Chart } from '../MarketChart';

const indexSymbolMap: Record<string, string> = {
  'S&P 500': '^GSPC',
  'NASDAQ': '^IXIC',
  'DOW JONES': '^DJI',
  'FTSE 100': '^FTSE',
  'NIFTY 50': '^NSEI',
  'BANK NIFTY': '^NSEBANK',
};

export default function MarketOverview() {
  const [selectedIndex, setSelectedIndex] = useState('S&P 500');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`/api/stocks/${indexSymbolMap[selectedIndex]}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then((json) => {
        setData(json);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [selectedIndex]);

  // Calculate KPIs from data
  let price = '--', change = '--', changePercent = '--', volume = '--', isUp = true;
  function formatVolume(val: string | number): string {
    const num = typeof val === 'string' ? parseFloat(val) : val;
    if (isNaN(num)) return '--';
    if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(2) + 'B';
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(2) + 'M';
    if (num >= 1_000) return (num / 1_000).toFixed(2) + 'K';
    return num.toString();
  }
  if (data && data.length > 1) {
    const sorted = [...data].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const latest = sorted[0];
    const prev = sorted[1];
    price = latest.close.toLocaleString();
    const diff = latest.close - prev.close;
    change = (diff >= 0 ? '+' : '') + diff.toFixed(2);
    changePercent = ((diff / prev.close) * 100).toFixed(2);
    isUp = diff >= 0;
    volume = latest.volume ? formatVolume(latest.volume) : '--';
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Market Overview</h2>
        <select 
          value={selectedIndex}
          onChange={(e) => setSelectedIndex(e.target.value)}
          className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {Object.keys(indexSymbolMap).map(index => (
            <option key={index} value={index}>{index}</option>
          ))}
        </select>
      </div>

      {/* Main Chart Area */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6 h-96 flex items-center justify-center">
        <Chart className="w-full h-full" symbol={indexSymbolMap[selectedIndex]} data={data} />
      </div>

      {/* Market Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <p className="text-sm text-gray-500">Price</p>
          <p className="text-lg font-semibold text-gray-900">{price}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500">Change</p>
          <p className={`text-lg font-semibold ${isUp ? 'text-green-600' : 'text-red-600'}`}>{change}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500">Change %</p>
          <div className="flex items-center justify-center space-x-1">
            {isUp ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600" />
            )}
            <p className={`text-lg font-semibold ${isUp ? 'text-green-600' : 'text-red-600'}`}>{changePercent}%</p>
          </div>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500">Volume</p>
          <p className="text-lg font-semibold text-gray-900">{volume}</p>
        </div>
      </div>
    </div>
  );
}