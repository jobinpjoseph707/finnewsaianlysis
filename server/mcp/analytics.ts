import { Strategy } from "../../shared/schema";

/**
 * Analytics Service
 * Provides analytics on strategies and their performance.
 */
export class AnalyticsService {
  constructor(private strategies: Strategy[]) {}

  /**
   * Get top performing strategies
   */
  getTopStrategies(limit: number = 5) {
    // Placeholder: Sort by expectedReturn (should use real performance metrics)
    return this.strategies
      .filter(s => s.status === "active" || s.status === "suggested")
      .sort((a, b) => {
        const aReturn = parseFloat((a.expectedReturn || "0").replace(/[^\d.-]/g, ""));
        const bReturn = parseFloat((b.expectedReturn || "0").replace(/[^\d.-]/g, ""));
        return bReturn - aReturn;
      })
      .slice(0, limit);
  }

  /**
   * Get strategy performance breakdown
   */
  getStrategyPerformance(strategyId: number) {
    // Placeholder: Return mock performance data
    return {
      strategyId,
      performance: [
        { date: "2021-01-01", value: 100 },
        { date: "2022-01-01", value: 112 },
        { date: "2023-01-01", value: 130 },
        { date: "2024-01-01", value: 156 }
      ]
    };
  }
}
