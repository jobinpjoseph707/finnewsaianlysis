/**
 * MCP (Model Context Protocol) implementation
 * This module integrates with Model Context Protocol for context-aware investment strategies
 */

import { StrategyRepository } from "./strategy-repository";
import { SentimentAnalyzer } from "./sentiment-analyzer";
import { MarketDataService } from "./market-data";

// Initialize MCP services
export const strategyRepository = new StrategyRepository();
export const sentimentAnalyzer = new SentimentAnalyzer();
export const marketDataService = new MarketDataService();

// MCP Status types
export type MCPModuleStatus = 'ACTIVE' | 'TRAINING' | 'ERROR' | 'PAUSED';

export interface MCPStatus {
  name: string;
  status: MCPModuleStatus;
  message: string;
  details?: any;
}

/**
 * Get the status of all MCP modules
 */
export function getMCPStatus(): MCPStatus[] {
  return [
    {
      name: "Strategy Repository",
      status: "ACTIVE",
      message: `${strategyRepository.getStrategyCount()} strategies stored`
    },
    {
      name: "Market Data Feed",
      status: "ACTIVE",
      message: `Last updated ${getLastUpdateTime(marketDataService.getLastUpdateTime())}`
    },
    {
      name: "Sentiment Analysis",
      status: "ACTIVE",
      message: `${sentimentAnalyzer.getSourceCount()} news sources monitored`
    },
    {
      name: "Learning System",
      status: "TRAINING",
      message: "Model optimization in progress"
    }
  ];
}

/**
 * Format last update time as a human-readable string
 */
function getLastUpdateTime(timestamp: number): string {
  const now = Date.now();
  const diffMs = now - timestamp;
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return "just now";
  if (diffMins === 1) return "1 minute ago";
  if (diffMins < 60) return `${diffMins} minutes ago`;
  
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours === 1) return "1 hour ago";
  return `${diffHours} hours ago`;
}
