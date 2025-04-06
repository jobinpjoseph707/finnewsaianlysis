/**
 * MCP Strategy Repository
 * Handles storage and retrieval of investment strategies in MCP context
 */

import { Strategy, InsertStrategy } from "@shared/schema";
import { generateRandomId } from "../utils";

export class StrategyRepository {
  private strategies: Strategy[] = [];
  
  constructor() {
    // Initialize with some sample strategies
    this.initializeStrategies();
  }
  
  /**
   * Initialize with sample strategies for development
   */
  private initializeStrategies() {
    const now = new Date();
    
    // Sample strategies
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
        generatedAt: new Date(now.getTime() - 10 * 60 * 1000), // 10 minutes ago
        status: "active",
        context: { reasoning: "Positive sentiment on global tech spending" }
      },
      {
        id: 2,
        title: "Defensive Portfolio Shift",
        description: "Increase allocation to consumer staples and pharma sectors as a hedge against potential market volatility around upcoming election events.",
        confidenceLevel: "Medium Confidence",
        riskLevel: "Low",
        timeHorizon: "1-3 months",
        expectedReturn: "6-8%",
        sectors: ["Consumer Staples", "Pharma"],
        generatedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
        status: "active",
        context: { reasoning: "Increasing market volatility indicators" }
      },
      {
        id: 3,
        title: "PSU Banking Momentum",
        description: "Consider momentum trade on PSU banks following recent credit growth data and positive sentiment from government infrastructure spending.",
        confidenceLevel: "Speculative",
        riskLevel: "High",
        timeHorizon: "2-4 weeks",
        expectedReturn: "10-18%",
        sectors: ["Banking", "PSU", "Financial Services"],
        generatedAt: new Date(), // Now
        status: "active",
        context: { reasoning: "Recent credit growth data shows promising trends" }
      }
    ];
  }
  
  /**
   * Get all strategies
   */
  getStrategies(): Strategy[] {
    return this.strategies;
  }
  
  /**
   * Get a strategy by ID
   */
  getStrategyById(id: number): Strategy | undefined {
    return this.strategies.find(strategy => strategy.id === id);
  }
  
  /**
   * Create a new strategy
   */
  createStrategy(strategy: InsertStrategy): Strategy {
    const newStrategy: Strategy = {
      id: generateRandomId(),
      ...strategy,
      generatedAt: new Date(),
      status: "active"
    };
    
    this.strategies.push(newStrategy);
    return newStrategy;
  }
  
  /**
   * Update a strategy
   */
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
  
  /**
   * Get strategies by sector
   */
  getStrategiesBySector(sector: string): Strategy[] {
    return this.strategies.filter(strategy => 
      strategy.sectors.includes(sector)
    );
  }
  
  /**
   * Get strategies by confidence level
   */
  getStrategiesByConfidence(confidenceLevel: string): Strategy[] {
    return this.strategies.filter(strategy => 
      strategy.confidenceLevel === confidenceLevel
    );
  }
  
  /**
   * Get the total count of strategies
   */
  getStrategyCount(): number {
    return this.strategies.length;
  }
  
  /**
   * Get active strategies count
   */
  getActiveStrategyCount(): number {
    return this.strategies.filter(strategy => strategy.status === "active").length;
  }
  
  /**
   * Get top performing strategies
   */
  getTopPerformingStrategies(limit: number = 2): any[] {
    return [
      {
        name: "Midcap IT Allocation",
        date: "June 12, 2023",
        return: "+24.7%"
      },
      {
        name: "PSU Bank Rotation",
        date: "May 28, 2023",
        return: "+18.2%"
      }
    ];
  }
}
