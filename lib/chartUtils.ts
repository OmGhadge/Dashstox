export function formatVolume(val: string | number): string {
  const num = typeof val === 'string' ? parseFloat(val) : val;
  if (isNaN(num)) return '--';
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(2) + 'B';
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(2) + 'M';
  if (num >= 1_000) return (num / 1_000).toFixed(2) + 'K';
  return num.toString();
} 