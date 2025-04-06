import { MarketDataPoint } from "./types";

/**
 * Generates mock chart data for demonstration purposes
 */
export function generateChartData(
  baseValue: number,
  volatility: number,
  pointCount: number = 50,
  trend: 'up' | 'down' | 'neutral' = 'neutral'
): MarketDataPoint[] {
  const data: MarketDataPoint[] = [];
  let value = baseValue;
  const now = Date.now();
  const timeStep = 5 * 60 * 1000; // 5 minutes in milliseconds
  
  // Trend factor
  const trendFactor = trend === 'up' ? 0.1 : trend === 'down' ? -0.1 : 0;
  
  for (let i = 0; i < pointCount; i++) {
    // Generate a random change with the given volatility
    const change = (Math.random() - 0.5) * volatility + trendFactor;
    
    // Update the value
    value = Math.max(0, value + change);
    
    // Add the data point
    data.push({
      time: now - (pointCount - i) * timeStep,
      value
    });
  }
  
  return data;
}

/**
 * Format large numbers for display
 */
export function formatNumber(num: number, decimals: number = 2): string {
  if (num === undefined || num === null) return 'N/A';
  
  if (Math.abs(num) >= 1000000000) {
    return (num / 1000000000).toFixed(decimals) + 'B';
  }
  
  if (Math.abs(num) >= 1000000) {
    return (num / 1000000).toFixed(decimals) + 'M';
  }
  
  if (Math.abs(num) >= 1000) {
    return (num / 1000).toFixed(decimals) + 'K';
  }
  
  return num.toFixed(decimals);
}

/**
 * Format percentage values
 */
export function formatPercentage(value: number): string {
  if (value === undefined || value === null) return 'N/A';
  
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}
