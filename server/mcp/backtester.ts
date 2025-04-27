import { Strategy, MarketData } from "../../shared/schema";

/**
 * Backtester
 * Simulates strategy performance using historical market data.
 */
export class Backtester {
  constructor(private historicalData: MarketData[]) {}

  /**
   * Backtest a strategy over the last 4 years
   */
  backtest(strategy: Strategy): any {
    // Example: Simple backtesting logic (replace with realistic simulation as needed)
    const relevantData = this.historicalData.filter(d =>
      strategy.sectors.some((sector: string) => (d as any).sectors?.includes(sector))
    ); // Filter historical data by sector
    // Simulate returns (placeholder logic)
    const simulatedReturn = (Math.random() * 0.3 - 0.05).toFixed(2); // -5% to +25%
    return {
      strategyId: strategy.id,
      simulatedReturn: `${(parseFloat(simulatedReturn) * 100).toFixed(1)}%`,
      period: "4 years",
      details: relevantData.slice(0, 10) // example: show first 10 data points
    };
  }
}
