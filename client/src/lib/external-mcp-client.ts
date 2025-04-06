import { 
  MarketData, 
  Strategy, 
  News, 
  SectorSentiment, 
  McpStatus 
} from "@shared/schema";
import { apiRequest } from "./queryClient";

/**
 * External MCP Client
 * Connects to the Model Context Protocol server for data processing and analysis
 */
export class ExternalMCPClient {
  private static baseUrl: string;
  private static apiKey: string;
  
  /**
   * Initialize the MCP client with the server URL and API key
   */
  static initialize(baseUrl: string, apiKey: string) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
    console.log("External MCP client initialized with server:", baseUrl);
  }
  
  /**
   * Check if the client is properly configured
   */
  private static checkConfig() {
    if (!this.baseUrl || !this.apiKey) {
      throw new Error("MCP client not initialized. Call initialize() first with server URL and API key.");
    }
  }
  
  /**
   * Make an authenticated request to the MCP server
   */
  private static async makeRequest<T>(endpoint: string, method: string = 'GET', data?: any): Promise<T> {
    this.checkConfig();
    
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json'
    };
    
    try {
      const response = await fetch(url, {
        method,
        headers,
        body: data ? JSON.stringify(data) : undefined
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`MCP server error (${response.status}): ${errorText}`);
      }
      
      return await response.json() as T;
    } catch (error) {
      console.error("MCP request failed:", error);
      throw error;
    }
  }
  
  /**
   * Get live market data from MCP context
   */
  static async getMarketData(): Promise<MarketData[]> {
    return this.makeRequest<MarketData[]>('/market-data');
  }
  
  /**
   * Get strategy recommendations based on current market context
   */
  static async getStrategies(): Promise<Strategy[]> {
    return this.makeRequest<Strategy[]>('/strategies');
  }
  
  /**
   * Get sentiment analysis data
   */
  static async getSentimentAnalysis(): Promise<any> {
    return this.makeRequest<any>('/sentiment');
  }
  
  /**
   * Get performance tracking data
   */
  static async getPerformanceTracking(): Promise<any> {
    return this.makeRequest<any>('/performance');
  }
  
  /**
   * Get MCP system status
   */
  static async getMCPStatus(): Promise<McpStatus[]> {
    return this.makeRequest<McpStatus[]>('/status');
  }
  
  /**
   * Create a new strategy in the MCP context
   */
  static async createStrategy(strategy: Partial<Strategy>): Promise<Strategy> {
    return this.makeRequest<Strategy>('/strategies', 'POST', strategy);
  }
  
  /**
   * Update a strategy's performance
   */
  static async updateStrategyPerformance(id: number, performance: number): Promise<Strategy> {
    return this.makeRequest<Strategy>(`/strategies/${id}/performance`, 'PATCH', { performance });
  }
  
  /**
   * Get sector-specific sentiment data
   */
  static async getSectorSentiment(sector: string): Promise<SectorSentiment> {
    return this.makeRequest<SectorSentiment>(`/sentiment/sector/${sector}`);
  }
  
  /**
   * Get latest financial news
   */
  static async getLatestNews(limit: number = 10): Promise<News[]> {
    return this.makeRequest<News[]>(`/news?limit=${limit}`);
  }
}

// Function to check if MCP credentials are configured
export async function checkMCPConfiguration(): Promise<boolean> {
  try {
    // Check if MCP environment variables are set
    const mcpUrl = localStorage.getItem('MCP_SERVER_URL');
    const mcpKey = localStorage.getItem('MCP_API_KEY');
    
    if (!mcpUrl || !mcpKey) {
      console.warn("MCP configuration not found in local storage");
      return false;
    }
    
    // Initialize the client
    ExternalMCPClient.initialize(mcpUrl, mcpKey);
    
    // Try to ping the MCP server to verify connection
    await ExternalMCPClient.getMCPStatus();
    console.log("MCP server connection verified");
    return true;
  } catch (error) {
    console.error("MCP server connection failed:", error);
    return false;
  }
}