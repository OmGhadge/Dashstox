import React, { useEffect, useState, useRef } from 'react';
import { createChart, type IChartApi, type CandlestickData, CandlestickSeries, LineStyle, LineSeries, LineData } from 'lightweight-charts';
import { StockPrice } from '@/lib/chartIndicators';

const formatVolume = (volume: number) => {
  if (volume >= 1000000) {
    return `${(volume / 1000000).toFixed(1)}M`;
  } else if (volume >= 1000) {
    return `${(volume / 1000).toFixed(1)}K`;
  }
  return volume.toString();
};

const calcMA = (data: StockPrice[], period: number) => {
  return data.map((row, i) => {
    if (i < period - 1) return { time: row.date.split('T')[0], value: NaN };
    const sum = data.slice(i - period + 1, i + 1).reduce((acc, r) => acc + r.close, 0);
    return { time: row.date.split('T')[0], value: sum / period };
  });
};

const calcEMA = (data: StockPrice[], period: number) => {
  let prevEMA = data[0]?.close || 0;
  const k = 2 / (period + 1);
  return data.map((row, i) => {
    if (i === 0) return { time: row.date.split('T')[0], value: prevEMA };
    prevEMA = row.close * k + prevEMA * (1 - k);
    return { time: row.date.split('T')[0], value: prevEMA };
  });
};

const calcBB = (data: StockPrice[], period: number, stdDev: number) => {
  const upper: { time: string; value: number }[] = [];
  const lower: { time: string; value: number }[] = [];
  for (let i = 0; i < data.length; i++) {
    const time = data[i].date.split('T')[0];
    if (i < period - 1) {
      upper.push({ time, value: NaN });
      lower.push({ time, value: NaN });
    } else {
      const slice = data.slice(i - period + 1, i + 1);
      const mean = slice.reduce((acc, r) => acc + r.close, 0) / period;
      const variance = slice.reduce((acc, r) => acc + Math.pow(r.close - mean, 2), 0) / period;
      const sd = Math.sqrt(variance);
      upper.push({ time, value: mean + stdDev * sd });
      lower.push({ time, value: mean - stdDev * sd });
    }
  }
  return { upper, lower };
};

const calcRSI = (data: StockPrice[], period: number) => {
  const rsi: { time: string; value: number }[] = [];
  let avgGain = 0, avgLoss = 0;
  for (let i = 0; i < data.length; i++) {
    const time = data[i].date.split('T')[0];
    if (i < period) {
      rsi.push({ time, value: NaN });
    } else {
      let gain = 0, loss = 0;
      for (let j = i - period + 1; j <= i; j++) {
        const diff = data[j].close - data[j - 1].close;
        if (diff > 0) gain += diff;
        else loss -= diff;
      }
      avgGain = gain / period;
      avgLoss = loss / period;
      let rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
      rsi.push({ time, value: 100 - 100 / (1 + rs) });
    }
  }
  return rsi;
};

const ChartComponent: React.FC<{
  symbol: string;
  sidebarOpen: boolean;
  setChartData: (data: any[]) => void;
  indicators?: string[];
  fromDate?: string;
  toDate?: string;
  onError?: (msg: string) => void;
  chartType?: 'candlestick' | 'line';
}> = ({ symbol, sidebarOpen, setChartData, indicators = [], fromDate, toDate, onError, chartType = 'candlestick' }) => {
  const [data, setData] = useState<StockPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ReturnType<IChartApi['addSeries']> | null>(null);
  const lineSeriesRef = useRef<ReturnType<IChartApi['addSeries']> | null>(null);
  const ma20SeriesRef = useRef<ReturnType<IChartApi['addSeries']> | null>(null);
  const ma50SeriesRef = useRef<ReturnType<IChartApi['addSeries']> | null>(null);
  const bbUpperSeriesRef = useRef<ReturnType<IChartApi['addSeries']> | null>(null);
  const bbLowerSeriesRef = useRef<ReturnType<IChartApi['addSeries']> | null>(null);
  const ema20SeriesRef = useRef<ReturnType<IChartApi['addSeries']> | null>(null);
  const rsiSeriesRef = useRef<ReturnType<IChartApi['addSeries']> | null>(null);
  const ma100SeriesRef = useRef<ReturnType<IChartApi['addSeries']> | null>(null);
  const ma200SeriesRef = useRef<ReturnType<IChartApi['addSeries']> | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    let url = `/api/stocks/${symbol}`;
    if (fromDate) url += `?from=${fromDate}`;
    if (toDate) url += fromDate ? `&to=${toDate}` : `?to=${toDate}`;
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then((json) => {
        setData(json);
        setChartData(json);
      })
      .catch((err) => {
        setError(err.message);
        if (onError) onError('No symbol exists.');
      })
      .finally(() => setLoading(false));
  }, [symbol, fromDate, toDate]);

  useEffect(() => {
    if (!chartContainerRef.current || data.length === 0) return;
    // Clean up previous chart instance by clearing the container
    if (chartRef.current) {
      if (chartContainerRef.current) {
        chartContainerRef.current.innerHTML = '';
      }
      chartRef.current = null;
    }

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
      layout: { background: { color: '#fff' }, textColor: '#222' },
      grid: { vertLines: { color: '#eee' }, horzLines: { color: '#eee' } },
      timeScale: { timeVisible: true, secondsVisible: false },
    });
    chartRef.current = chart;

    if (chartType === 'candlestick') {
      const candleSeries = chart.addSeries(CandlestickSeries, {
        upColor: '#26a69a',
        downColor: '#ef5350',
        borderVisible: false,
        wickUpColor: '#26a69a',
        wickDownColor: '#ef5350',
      });
      candleSeriesRef.current = candleSeries;
      const candleData: CandlestickData[] = data.map((row) => ({
        time: row.date.split('T')[0],
        open: row.open,
        high: row.high,
        low: row.low,
        close: row.close,
      }));
      candleSeries.setData([...candleData].sort((a, b) => (a.time > b.time ? 1 : -1)));
    } else {
      const lineSeries = chart.addSeries(LineSeries, {
        color: '#1976d2',
        lineWidth: 2,
        lineStyle: LineStyle.Solid,
      });
      lineSeriesRef.current = lineSeries;
      const lineData: LineData[] = data.map((row) => ({
        time: row.date.split('T')[0],
        value: row.close,
      }));
      lineSeries.setData([...lineData].sort((a, b) => (a.time > b.time ? 1 : -1)));
    }

    // Add/remove MA20
    if (indicators.includes('ma20')) {
      const ma20 = calcMA(data, 20);
      ma20SeriesRef.current = chart.addSeries(LineSeries, { color: '#1976d2', lineWidth: 2, lineStyle: LineStyle.Solid });
      if (ma20SeriesRef.current) ma20SeriesRef.current.setData(ma20.filter(point => !isNaN(point.value)).sort((a, b) => (a.time > b.time ? 1 : -1)));
    } else if (ma20SeriesRef.current) {
      ma20SeriesRef.current.setData([]);
      ma20SeriesRef.current = null;
    }

    // Add/remove MA50
    if (indicators.includes('ma50')) {
      const ma50 = calcMA(data, 50);
      ma50SeriesRef.current = chart.addSeries(LineSeries, { color: '#ff9800', lineWidth: 2, lineStyle: LineStyle.Solid });
      if (ma50SeriesRef.current) ma50SeriesRef.current.setData(ma50.filter(point => !isNaN(point.value)).sort((a, b) => (a.time > b.time ? 1 : -1)));
    } else if (ma50SeriesRef.current) {
      ma50SeriesRef.current.setData([]);
      ma50SeriesRef.current = null;
    }

    // Add/remove EMA20
    if (indicators.includes('ema20')) {
      const ema20 = calcEMA(data, 20);
      ema20SeriesRef.current = chart.addSeries(LineSeries, { color: '#8e24aa', lineWidth: 2, lineStyle: LineStyle.Solid });
      if (ema20SeriesRef.current) ema20SeriesRef.current.setData(ema20.filter(point => !isNaN(point.value)).sort((a, b) => (a.time > b.time ? 1 : -1)));
    } else if (ema20SeriesRef.current) {
      ema20SeriesRef.current.setData([]);
      ema20SeriesRef.current = null;
    }

    // Add/remove Bollinger Bands (20, 2)
    if (indicators.includes('bb20')) {
      const bb = calcBB(data, 20, 2);
      bbUpperSeriesRef.current = chart.addSeries(LineSeries, { color: '#0288d1', lineWidth: 1, lineStyle: LineStyle.Solid });
      bbLowerSeriesRef.current = chart.addSeries(LineSeries, { color: '#0288d1', lineWidth: 1, lineStyle: LineStyle.Solid });
      if (bbUpperSeriesRef.current) bbUpperSeriesRef.current.setData(bb.upper.filter(point => !isNaN(point.value)).sort((a, b) => (a.time > b.time ? 1 : -1)));
      if (bbLowerSeriesRef.current) bbLowerSeriesRef.current.setData(bb.lower.filter(point => !isNaN(point.value)).sort((a, b) => (a.time > b.time ? 1 : -1)));
    } else {
      if (bbUpperSeriesRef.current) bbUpperSeriesRef.current.setData([]);
      if (bbLowerSeriesRef.current) bbLowerSeriesRef.current.setData([]);
      bbUpperSeriesRef.current = null;
      bbLowerSeriesRef.current = null;
    }

    // Add/remove MA100
    if (indicators.includes('ma100')) {
      const ma100 = calcMA(data, 100);
      ma100SeriesRef.current = chart.addSeries(LineSeries, { color: '#009688', lineWidth: 2, lineStyle: LineStyle.Solid });
      if (ma100SeriesRef.current) ma100SeriesRef.current.setData(ma100.filter(point => !isNaN(point.value)).sort((a, b) => (a.time > b.time ? 1 : -1)));
    } else if (ma100SeriesRef.current) {
      ma100SeriesRef.current.setData([]);
      ma100SeriesRef.current = null;
    }

    // Add/remove MA200
    if (indicators.includes('ma200')) {
      const ma200 = calcMA(data, 200);
      ma200SeriesRef.current = chart.addSeries(LineSeries, { color: '#e65100', lineWidth: 2, lineStyle: LineStyle.Solid });
      if (ma200SeriesRef.current) ma200SeriesRef.current.setData(ma200.filter(point => !isNaN(point.value)).sort((a, b) => (a.time > b.time ? 1 : -1)));
    } else if (ma200SeriesRef.current) {
      ma200SeriesRef.current.setData([]);
      ma200SeriesRef.current = null;
    }

  }, [data, indicators, fromDate, toDate, chartType]);

  // Resize chart when sidebar state changes
  useEffect(() => {
    if (chartRef.current && chartContainerRef.current) {
      const resizeChart = () => {
        if (chartContainerRef.current) {
          const newWidth = chartContainerRef.current.clientWidth;
          const newHeight = chartContainerRef.current.clientHeight;
          
          chartRef.current?.applyOptions({
            width: newWidth,
            height: newHeight,
          });
          
          // Force a redraw to ensure the chart updates properly
          chartRef.current?.timeScale().fitContent();
        }
      };
      
      // Multiple resize attempts to ensure proper sizing
      const timeoutId1 = setTimeout(resizeChart, 50);
      const timeoutId2 = setTimeout(resizeChart, 150);
      const timeoutId3 = setTimeout(resizeChart, 300);
      
      return () => {
        clearTimeout(timeoutId1);
        clearTimeout(timeoutId2);
        clearTimeout(timeoutId3);
      };
    }
  }, [sidebarOpen]);

  // Also resize on window resize
  useEffect(() => {
    const handleResize = () => {
      if (chartRef.current && chartContainerRef.current) {
        const newWidth = chartContainerRef.current.clientWidth;
        const newHeight = chartContainerRef.current.clientHeight;
        
        chartRef.current?.applyOptions({
          width: newWidth,
          height: newHeight,
        });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <>
      <div
        ref={chartContainerRef}
        className="w-full h-full"
      />
    </>
  );
};

export default ChartComponent; 