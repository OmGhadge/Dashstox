"use client";

import React, {  useState } from 'react';

import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { Search,  Plus, AreaChart, LineChart } from 'lucide-react';
import { useWatchlist } from '@/contexts/WatchlistContext';
import AuthGuard from '@/components/AuthGuard';

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';
import WatchlistSidebar from '@/components/WatchlistSidebar';
import ChartComponent from '@/components/ChartComponent';
import { formatVolume } from '@/lib/chartUtils';


interface StockPrice {
  id: number;
  symbol: string;
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: string;
}



export default function ChartsPage() {
  const [symbol, setSymbol] = useState('AAPL');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchError, setSearchError] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const { watchlist, addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chartData, setChartData] = useState<StockPrice[]>([]);
  const [selectedIndicators, setSelectedIndicators] = useState<string[]>([]);
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');
  const [chartType, setChartType] = useState<'candlestick' | 'line'>('candlestick');


  let price = '--', change = '--', changePercent = '--', volume = '--', isUp = true;
  if (chartData && chartData.length > 1) {
    const sorted = [...chartData].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const latest = sorted[0];
    const prev = sorted[1];
    price = latest.close.toLocaleString();
    const diff = latest.close - prev.close;
    change = (diff >= 0 ? '+' : '') + diff.toFixed(2);
    changePercent = ((diff / prev.close) * 100).toFixed(2);
    isUp = diff >= 0;
    volume = latest.volume ? formatVolume(latest.volume) : '--';
  }



  const handleAddToWatchlist = () => {
    addToWatchlist(symbol);
  };

  const handleSymbolInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value.toUpperCase());
    setSearchError('');
  };
  const handleSymbolSubmit = () => {
    if (searchQuery.trim()) {
      setSymbol(searchQuery.trim().toUpperCase());
      setSearchError('');
    }
  };

  const indicatorOptions = [
    { label: '20-period Moving Average', value: 'ma20' },
    { label: '50-period Moving Average', value: 'ma50' },
    { label: '100-period Moving Average', value: 'ma100' },
    { label: '200-period Moving Average', value: 'ma200' },
    { label: '20-period EMA', value: 'ema20' },
    { label: 'Bollinger Bands (20, 2)', value: 'bb20' },
  ];


  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader />
        
        <main className="pt-2">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          
          

          
            <div className={`transition-all duration-300 ${sidebarOpen ? 'mr-64' : 'mr-0'}`}> 
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 pb-12">
                <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
                  <h2 className="text-xl font-semibold text-gray-900">{symbol} - Stock Chart</h2>
                  <div className="flex items-center gap-4 w-full md:w-auto">
                    
                    <input
                      type="date"
                      value={fromDate}
                      onChange={e => setFromDate(e.target.value)}
                      className="border rounded px-2 py-1 text-sm"
                      placeholder="From"
                    />
                    <span className="text-gray-500">to</span>
                    <input
                      type="date"
                      value={toDate}
                      onChange={e => setToDate(e.target.value)}
                      className="border rounded px-2 py-1 text-sm"
                      placeholder="To"
                    />
                    
                    <div className="relative max-w-md w-64">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSymbolInput}
                        onBlur={handleSymbolSubmit}
                        onKeyDown={e => { if (e.key === 'Enter') handleSymbolSubmit(); }}
                        placeholder="Search stocks..."
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                    {searchError && (
                      <div className="text-red-600 text-sm mt-1">{searchError}</div>
                    )}
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="w-48 flex items-center justify-between border border-gray-300 rounded-md px-3 py-2 text-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
                          Indicators
                          <svg className="ml-2 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-48">
                        {indicatorOptions.map(opt => (
                          <DropdownMenuCheckboxItem
                            key={opt.value}
                            checked={selectedIndicators.includes(opt.value)}
                            onCheckedChange={checked => {
                              setSelectedIndicators(prev =>
                                checked
                                  ? [...prev, opt.value]
                                  : prev.filter(v => v !== opt.value)
                              );
                            }}
                          >
                            {opt.label}
                          </DropdownMenuCheckboxItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                    
                    <button
                      type="button"
                      onClick={() => setChartType(chartType === 'candlestick' ? 'line' : 'candlestick')}
                      className={`p-2 rounded-md border border-gray-300 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center`}
                    >
                      <LineChart className={`h-5 w-5 transition-colors ${chartType === 'line' ? 'text-blue-600' : 'text-gray-400'}`} />
                    </button>
                    <button
                      onClick={handleAddToWatchlist}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      title="Add to Watchlist"
                    >
                      <Plus className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                
                <div className="bg-gray-50 rounded-lg p-4 h-96">
                  <ChartComponent
                    symbol={symbol}
                    sidebarOpen={sidebarOpen}
                    setChartData={setChartData}
                    indicators={selectedIndicators}
                    fromDate={fromDate}
                    toDate={toDate}
                    onError={setSearchError}
                    chartType={chartType}
                  />
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
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
                        <span className="inline-block w-4 h-4 bg-green-100 rounded-full mr-1"></span>
                      ) : (
                        <span className="inline-block w-4 h-4 bg-red-100 rounded-full mr-1"></span>
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
            </div>
          </div>
        </main>

        
        <WatchlistSidebar 
          watchlist={watchlist} 
          onRemove={removeFromWatchlist}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />

        
        {showDropdown && (
          <div 
            className="fixed inset-0 z-0" 
            onClick={() => setShowDropdown(false)}
          />
        )}
      </div>
    </AuthGuard>
  );
} 