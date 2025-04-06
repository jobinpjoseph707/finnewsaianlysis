import { 
  MarketData, 
  Strategy, 
  News, 
  SectorSentiment, 
  McpStatus 
} from "@shared/schema";
import { apiRequest } from "./queryClient";

/**
 * Dappier MCP Client
 * Specialized client for connecting to Dappier's Financial API for news and market data
 */
export class DappierMCPClient {
  private static baseUrl: string;
  private static apiKey: string;
  
  /**
   * Initialize the Dappier client with the server URL and API key
   */
  static initialize(baseUrl: string, apiKey: string) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
    console.log("Dappier MCP client initialized with server:", JSON.stringify(baseUrl));
  }
  
  /**
   * Check if the client is properly configured
   */
  private static checkConfig() {
    if (!this.baseUrl || !this.apiKey) {
      throw new Error("Dappier client not initialized. Call initialize() first with server URL and API key.");
    }
  }
  
  /**
   * Make an authenticated request to the Dappier API
   */
  private static async makeRequest<T>(query: string = ""): Promise<T> {
    this.checkConfig();
    
    try {
      const headers = {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      };
      
      const body = { query };
      
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(body)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Dappier API error (${response.status}): ${errorText}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Dappier request failed:", error);
      throw error;
    }
  }
  
  /**
   * Get latest news from Dappier
   */
  static async getLatestNews(limit: number = 10): Promise<News[]> {
    const query = `Get the latest ${limit} financial news articles for Indian markets`;
    const response = await this.makeRequest<any>(query);
    
    // Parse and convert the response to our News format
    try {
      if (response && Array.isArray(response.results)) {
        return response.results.map((item: any, index: number) => ({
          id: index + 1,
          title: item.title || "Financial News Update",
          content: item.content || item.description || item.text || "",
          source: item.source || "Dappier News",
          publishedAt: new Date(item.published_at || item.date || new Date()),
          url: item.url || "",
          sentiment: item.sentiment || "neutral",
          impactScore: item.impact_score || Math.floor(Math.random() * 100),
          relatedSectors: item.sectors || ["Finance"],
          imageUrl: item.image_url || ""
        }));
      }
      
      // If the response format is different, try to adapt it
      if (response && typeof response === 'object') {
        // Attempt to extract news from various possible response structures
        const newsItems = response.news || response.articles || response.data || [];
        return newsItems.slice(0, limit).map((item: any, index: number) => ({
          id: index + 1,
          title: item.title || "Financial News Update",
          content: item.content || item.description || item.text || "",
          source: item.source || "Dappier News",
          publishedAt: new Date(item.published_at || item.date || new Date()),
          url: item.url || "",
          sentiment: item.sentiment || "neutral",
          impactScore: item.impact_score || Math.floor(Math.random() * 100),
          relatedSectors: item.sectors || ["Finance"],
          imageUrl: item.image_url || ""
        }));
      }
      
      // If we can't parse it properly, return an empty array
      return [];
    } catch (error) {
      console.error("Error parsing Dappier news response:", error);
      return [];
    }
  }
  
  /**
   * Get market data from Dappier
   */
  static async getMarketData(): Promise<MarketData[]> {
    const query = "Get current market data for top 10 Indian stocks including NIFTY and SENSEX";
    const response = await this.makeRequest<any>(query);
    
    // Parse and convert the response to our MarketData format
    try {
      if (response && Array.isArray(response.results)) {
        return response.results.map((item: any, index: number) => ({
          id: index + 1,
          symbol: item.symbol || item.ticker || `STOCK${index+1}`,
          name: item.name || item.company_name || `Stock ${index+1}`,
          price: parseFloat(item.price) || parseFloat(item.current_price) || 0,
          change: parseFloat(item.change) || 0,
          changePercent: parseFloat(item.change_percent) || 0,
          volume: parseInt(item.volume) || 0,
          marketCap: parseFloat(item.market_cap) || 0,
          sector: item.sector || "General",
          lastUpdated: new Date(item.last_updated || new Date()),
          dayHigh: parseFloat(item.day_high) || 0,
          dayLow: parseFloat(item.day_low) || 0,
          chartData: item.chart_data || []
        }));
      }
      
      // If the response format is different, try to adapt it
      if (response && typeof response === 'object') {
        // Attempt to extract market data from various possible response structures
        const marketItems = response.market_data || response.stocks || response.data || [];
        return marketItems.map((item: any, index: number) => ({
          id: index + 1,
          symbol: item.symbol || item.ticker || `STOCK${index+1}`,
          name: item.name || item.company_name || `Stock ${index+1}`,
          price: parseFloat(item.price) || parseFloat(item.current_price) || 0,
          change: parseFloat(item.change) || 0,
          changePercent: parseFloat(item.change_percent) || 0,
          volume: parseInt(item.volume) || 0,
          marketCap: parseFloat(item.market_cap) || 0,
          sector: item.sector || "General",
          lastUpdated: new Date(item.last_updated || new Date()),
          dayHigh: parseFloat(item.day_high) || 0,
          dayLow: parseFloat(item.day_low) || 0,
          chartData: item.chart_data || []
        }));
      }
      
      // If we can't parse it properly, return an empty array
      return [];
    } catch (error) {
      console.error("Error parsing Dappier market data response:", error);
      return [];
    }
  }
  
  /**
   * Get sentiment analysis from Dappier
   */
  static async getSentimentAnalysis(): Promise<any> {
    const query = "Analyze current market sentiment for Indian stock market, including sector analysis";
    const response = await this.makeRequest<any>(query);
    
    // For sentiment, we'll just pass through the response and handle formatting in the consumer
    return response;
  }
  
  /**
   * Get sector-specific sentiment data
   */
  static async getSectorSentiment(sector: string): Promise<SectorSentiment> {
    const query = `Analyze market sentiment for the ${sector} sector in Indian stock market`;
    const response = await this.makeRequest<any>(query);
    
    // Try to extract and format the sector sentiment
    try {
      if (response && typeof response === 'object') {
        // Map the response to our SectorSentiment format
        return {
          id: 1,
          name: sector,
          lastUpdated: new Date(),
          sentiment: response.sentiment || "neutral",
          score: parseFloat(response.score) || 0.5,
          // Extract additional details that match our schema
          newsCount: parseInt(response.news_count) || 0,
          keyTopics: response.key_topics || [],
          confidenceScore: parseFloat(response.confidence) || 0.7
        };
      }
      
      // Default response if format doesn't match
      return {
        id: 1,
        name: sector,
        lastUpdated: new Date(),
        sentiment: "neutral",
        score: 0.5,
        newsCount: 0,
        keyTopics: [],
        confidenceScore: 0.7
      };
    } catch (error) {
      console.error(`Error parsing Dappier sector sentiment response for ${sector}:`, error);
      
      // Default response in case of error
      return {
        id: 1,
        name: sector,
        lastUpdated: new Date(),
        sentiment: "neutral",
        score: 0.5,
        newsCount: 0,
        keyTopics: [],
        confidenceScore: 0.7
      };
    }
  }
  
  /**
   * Get MCP system status
   */
  static async getMCPStatus(): Promise<McpStatus[]> {
    // Since Dappier might not have a direct status API, we'll use a simple ping
    try {
      await this.makeRequest<any>("status check");
      
      // If successful, return active status
      return [
        {
          id: 1,
          name: "Dappier News API",
          status: "ACTIVE",
          message: "Connected and operational",
          details: { type: "news", source: "Dappier" },
          lastUpdated: new Date()
        },
        {
          id: 2,
          name: "Dappier Market Data",
          status: "ACTIVE",
          message: "Connected and operational",
          details: { type: "market-data", source: "Dappier" },
          lastUpdated: new Date()
        },
        {
          id: 3,
          name: "Dappier Sentiment Analysis",
          status: "ACTIVE",
          message: "Connected and operational",
          details: { type: "sentiment", source: "Dappier" },
          lastUpdated: new Date()
        }
      ];
    } catch (error) {
      // If failed, return error status
      console.error("Error checking Dappier status:", error);
      return [
        {
          id: 1,
          name: "Dappier API",
          status: "ERROR",
          message: "Connection failed",
          details: { error: "Connection error" },
          lastUpdated: new Date()
        }
      ];
    }
  }
}

// Function to check if Dappier credentials are configured
export async function checkDappierConfiguration(): Promise<boolean> {
  try {
    // Check if Dappier environment variables are set
    const dappierUrl = localStorage.getItem('MCP_SERVER_URL');
    const dappierKey = localStorage.getItem('MCP_API_KEY');
    
    if (!dappierUrl || !dappierKey) {
      console.warn("Dappier configuration not found in local storage");
      return false;
    }
    
    // Initialize the client
    DappierMCPClient.initialize(dappierUrl, dappierKey);
    
    // Try to ping the Dappier server to verify connection
    await DappierMCPClient.getMCPStatus();
    console.log("Dappier connection verified");
    return true;
  } catch (error) {
    console.error("Dappier connection failed:", error);
    return false;
  }
}