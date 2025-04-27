// Copied from server/mcp/strategy-repository.ts for Vercel API use
import { Strategy as StrategyBase, InsertStrategy } from "../../shared/schema";

type Strategy = Omit<StrategyBase, 'sectors'> & { sectors: string[] };

export class StrategyRepository {
  private strategies: Strategy[] = [];

  constructor() {
    this.initializeStrategies();
  }

  private initializeStrategies() {
    const now = new Date();
    this.strategies = [
      {
        id: 1,
        title: "IT Sector Rotation",
        description: "Overweight IT sector stocks as US recession fears ease and rupee stabilizes against the dollar. Focus on companies with strong US client exposure.",
        confidenceLevel: "High Confidence",
        riskLevel: "Medium",
        timeHorizon: "3-6 months",
        expectedReturn: "12-15%",
        sectors: ["IT", "Technology"],
        generatedAt: new Date(now.getTime() - 10 * 60 * 1000),
        status: "active",
        performance: null,
        context: { reasoning: "Positive sentiment on global tech spending" }
      } as Strategy,
      {
        id: 2,
        title: "Defensive Portfolio Shift",
        description: "Increase allocation to consumer staples and pharma sectors as a hedge against potential market volatility around upcoming election events.",
        confidenceLevel: "Medium Confidence",
        riskLevel: "Low",
        timeHorizon: "1-3 months",
        expectedReturn: "6-8%",
        sectors: ["Consumer Staples", "Pharma"],
        generatedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
        status: "active",
        performance: null,
        context: { reasoning: "Increasing market volatility indicators" }
      } as Strategy,
      {
        id: 3,
        title: "PSU Banking Momentum",
        description: "Consider momentum trade on PSU banks following recent credit growth data and positive sentiment from government infrastructure spending.",
        confidenceLevel: "Speculative",
        riskLevel: "High",
        timeHorizon: "2-4 weeks",
        expectedReturn: "10-18%",
        sectors: ["Banking", "PSU", "Financial Services"],
        generatedAt: new Date(),
        status: "active",
        performance: null,
        context: { reasoning: "Recent credit growth data shows promising trends" }
      } as Strategy
    ];
  }

  getStrategies(): Strategy[] {
    return this.strategies;
  }

  getStrategyById(id: number): Strategy | undefined {
    return this.strategies.find(strategy => strategy.id === id);
  }

  createStrategy(strategy: InsertStrategy): Strategy {
    const newStrategy: Strategy = {
      id: Math.floor(Math.random() * 1e4) + 1,
      ...strategy,
      sectors: Array.isArray(strategy.sectors) ? strategy.sectors : [],
      generatedAt: new Date(),
      status: "active",
      performance: null,
      context: strategy.context ?? null
    };
    this.strategies.push(newStrategy);
    return newStrategy;
  }

  updateStrategy(id: number, update: Partial<Strategy>): Strategy | undefined {
    const index = this.strategies.findIndex(strategy => strategy.id === id);
    if (index === -1) return undefined;
    const updatedStrategy = {
      ...this.strategies[index],
      ...update
    };
    this.strategies[index] = updatedStrategy;
    return updatedStrategy;
  }

  getStrategiesBySector(sector: string): Strategy[] {
    return this.strategies.filter(strategy => strategy.sectors.includes(sector));
  }

  getStrategiesByConfidence(confidenceLevel: string): Strategy[] {
    return this.strategies.filter(strategy => strategy.confidenceLevel === confidenceLevel);
  }

  getStrategyCount(): number {
    return this.strategies.length;
  }

  getActiveStrategyCount(): number {
    return this.strategies.filter(strategy => strategy.status === "active").length;
  }

  getTopPerformingStrategies(limit: number = 2): any[] {
    return [
      { name: "Midcap IT Allocation", date: "June 12, 2023", return: "+24.7%" },
      { name: "PSU Bank Rotation", date: "May 28, 2023", return: "+18.2%" }
    ];
  }
}
