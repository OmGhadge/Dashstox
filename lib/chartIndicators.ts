
export interface IndicatorPoint {
  time: string;
  value: number;
}

export interface BBResult {
  upper: IndicatorPoint[];
  lower: IndicatorPoint[];
}

export interface StockPrice {
  id: number;
  symbol: string;
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: string;
}

export function calcMA(data: StockPrice[], period: number): IndicatorPoint[] {
  const closes = data.map(row => row.close);
  const dates = data.map(row => row.date.split('T')[0]);
  const ma: IndicatorPoint[] = [];
  for (let i = 0; i < closes.length; i++) {
    if (i + 1 >= period) {
      const sum = closes.slice(i + 1 - period, i + 1).reduce((a, b) => a + b, 0);
      ma.push({ time: dates[i], value: sum / period });
    }
  }
  return ma.sort((a, b) => (a.time > b.time ? 1 : -1));
}

export function calcEMA(data: StockPrice[], period: number): IndicatorPoint[] {
  const closes = data.map(row => row.close);
  const dates = data.map(row => row.date.split('T')[0]);
  const ema: IndicatorPoint[] = [];
  let prevEma = closes[0];
  const k = 2 / (period + 1);
  for (let i = 0; i < closes.length; i++) {
    if (i === 0) {
      prevEma = closes[0];
    } else {
      prevEma = closes[i] * k + prevEma * (1 - k);
    }
    if (i + 1 >= period) {
      ema.push({ time: dates[i], value: prevEma });
    }
  }
  return ema.sort((a, b) => (a.time > b.time ? 1 : -1));
}

export function calcBB(data: StockPrice[], period: number, stdDev: number): BBResult {
  const closes = data.map(row => row.close);
  const dates = data.map(row => row.date.split('T')[0]);
  const upper: IndicatorPoint[] = [];
  const lower: IndicatorPoint[] = [];
  for (let i = 0; i < closes.length; i++) {
    if (i + 1 >= period) {
      const slice = closes.slice(i + 1 - period, i + 1);
      const mean = slice.reduce((a, b) => a + b, 0) / period;
      const variance = slice.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / period;
      const sd = Math.sqrt(variance);
      upper.push({ time: dates[i], value: mean + stdDev * sd });
      lower.push({ time: dates[i], value: mean - stdDev * sd });
    }
  }
  return {
    upper: upper.sort((a, b) => (a.time > b.time ? 1 : -1)),
    lower: lower.sort((a, b) => (a.time > b.time ? 1 : -1)),
  };
}

export function calcRSI(data: StockPrice[], period: number): IndicatorPoint[] {
  const closes = data.map(row => row.close);
  const dates = data.map(row => row.date.split('T')[0]);
  const rsi: IndicatorPoint[] = [];
  let gains = 0, losses = 0;
  for (let i = 1; i <= period; i++) {
    const diff = closes[i] - closes[i - 1];
    if (diff >= 0) gains += diff; else losses -= diff;
  }
  gains /= period;
  losses /= period;
  let rs = losses === 0 ? 100 : gains / losses;
  rsi.push({ time: dates[period], value: 100 - 100 / (1 + rs) });
  for (let i = period + 1; i < closes.length; i++) {
    const diff = closes[i] - closes[i - 1];
    if (diff >= 0) {
      gains = (gains * (period - 1) + diff) / period;
      losses = (losses * (period - 1)) / period;
    } else {
      gains = (gains * (period - 1)) / period;
      losses = (losses * (period - 1) - diff) / period;
    }
    rs = losses === 0 ? 100 : gains / losses;
    rsi.push({ time: dates[i], value: 100 - 100 / (1 + rs) });
  }
  return rsi.sort((a, b) => (a.time > b.time ? 1 : -1));
} 