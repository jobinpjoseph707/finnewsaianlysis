import { apiRequest } from "./queryClient";
import { Strategy, MarketData, SentimentData, PerformanceData } from "./types";

// Base URL for API requests
const API_BASE = "/api";

// MCP Client for interacting with the MCP server
export class MCPClient {
  /**
   * Get live market data from MCP context
   */
  static async getMarketData(): Promise<MarketData[]> {
    const response = await apiRequest("GET", `${API_BASE}/mcp/market-data`, undefined);
    return response.json();
  }

  /**
   * Get strategy recommendations based on current market context
   */
  static async getStrategies(): Promise<Strategy[]> {
    const response = await apiRequest("GET", `${API_BASE}/mcp/strategies`, undefined);
    return response.json();
  }

  /**
   * Get sentiment analysis data
   */
  static async getSentimentAnalysis(): Promise<SentimentData> {
    const response = await apiRequest("GET", `${API_BASE}/mcp/sentiment`, undefined);
    return response.json();
  }

  /**
   * Get performance tracking data
   */
  static async getPerformanceTracking(): Promise<PerformanceData> {
    const response = await apiRequest("GET", `${API_BASE}/mcp/performance`, undefined);
    return response.json();
  }

  /**
   * Get MCP system status
   */
  static async getMCPStatus(): Promise<any[]> {
    const response = await apiRequest("GET", `${API_BASE}/mcp/status`, undefined);
    return response.json();
  }

  /**
   * Create a new strategy in the MCP context
   */
  static async createStrategy(strategy: Omit<Strategy, "id" | "generatedAt" | "performance" | "status">): Promise<Strategy> {
    const response = await apiRequest("POST", `${API_BASE}/mcp/strategies`, strategy);
    return response.json();
  }

  /**
   * Update a strategy's performance
   */
  static async updateStrategyPerformance(id: number, performance: number): Promise<Strategy> {
    const response = await apiRequest("PATCH", `${API_BASE}/mcp/strategies/${id}/performance`, { performance });
    return response.json();
  }
}
