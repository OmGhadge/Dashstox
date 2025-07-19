import React, { useEffect, useState, useRef } from 'react';
import { createChart, type IChartApi, type CandlestickData, CandlestickSeries } from 'lightweight-charts';


interface StockPrice {
    id: number;
    symbol: string;
    date: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: string; // volume is string because of BigInt serialization
  }

export const Chart = ({ className = "", symbol, data: propData }: { className?: string; symbol: string; data?: StockPrice[] }) => {
  const [data, setData] = useState<StockPrice[]>(propData || []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const candleSeriesRef = useRef<ReturnType<IChartApi['addSeries']> | null>(null);
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  useEffect(() => {
    if (propData) {
      setData(propData);
      setLoading(false);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    fetch(`/api/stocks/${symbol}`)
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
  }, [symbol, propData]);

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

    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    });
    candleSeriesRef.current = candleSeries;

    const candleData: CandlestickData[] = data.map((row) => ({
      time: row.date.split('T')[0], // YYYY-MM-DD
      open: row.open,
      high: row.high,
      low: row.low,
      close: row.close,
    }));
    candleSeries.setData([...candleData].sort((a, b) => (a.time > b.time ? 1 : -1)));
  }, [data]);

  return (
    <div
      ref={chartContainerRef}
      className={className}
      style={{ width: '100%', height: '100%' }}
    />
  );
}