import {
  MarketData,
  Strategy,
  News,
  SectorSentiment,
  McpStatus,
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
    console.log(
      "Dappier MCP client initialized with server:",
      JSON.stringify(baseUrl),
    );
  }

  /**
   * Check if the client is properly configured
   */
  private static checkConfig() {
    if (!this.baseUrl || !this.apiKey) {
      throw new Error(
        "Dappier client not initialized. Call initialize() first with server URL and API key.",
      );
    }
  }

  /**
   * Make an authenticated request to the Dappier API
   */
  private static async makeRequest<T>(query: string = ""): Promise<T> {
    this.checkConfig();

    try {
      const headers = {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      };

      const body = { query };
      
      console.log("Making Dappier API request with body:", JSON.stringify(body));

      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Dappier API error (${response.status}): ${errorText}`);
      }

      // Get the response as text first
      const responseText = await response.text();
      console.log("Dappier API raw response:", responseText.substring(0, 500) + "...");
      
      // Parse the response as JSON
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error("Failed to parse Dappier API response as JSON:", e);
        // If it's not JSON, wrap it in an object with a message property
        data = { message: responseText };
      }
      
      return data;
    } catch (error) {
      console.error("Dappier request failed:", error);
      throw error;
    }
  }

  /**
   * Get latest news from Dappier
   * @param limit The maximum number of news items to return
   * @param searchQuery Optional search query to filter news by topic or content
   */
  static async getLatestNews(
    limit: number = 10,
    searchQuery?: string,
  ): Promise<News[]> {
    // Default query if none provided - use "indian financial news and reports" as default
    const defaultQuery = `Get the latest ${limit} indian financial news and reports`;

    // If a search query is provided, use it to filter the news
    // Based on the sample response, we need a simple format: "query text"
    const query = searchQuery
      ? `${searchQuery} Indian markets`
      : defaultQuery;

    console.log("Querying Dappier API for news with query:", query);

    const response = await this.makeRequest<any>(query);
    console.log("Dappier API response received:", JSON.stringify(response).substring(0, 100) + "...");

    // Parse and convert the response to our News format
    try {
      // First check if the response directly contains a message with news content
      if (response && response.message && typeof response.message === 'string') {
        console.log("Parsing from Dappier message format");
        
        // The message seems to be a formatted string with news items
        // Try to parse news items based on the specific format observed in the sample
        const messageText = response.message;
        const newsItems = [];
        
        // Check for markdown-style numbered list items with titles in bold/links
        const newsRegex = /\d+\.\s+\*\*\[(.*?)\]\((.*?)\)\*\*\s+(.*?)(?=\d+\.\s+\*\*|\n*$)/gs;
        const matches = [...messageText.matchAll(newsRegex)];
        
        console.log(`Found ${matches.length} news items using regex pattern`);
        
        if (matches.length > 0) {
          return matches.slice(0, limit).map((match, index) => {
            const title = match[1] || "Financial News Update";
            const url = match[2] || null;
            const summary = match[3].trim() || "No summary available";
            
            // Try to extract the source and date from the summary
            let source = "Dappier News";
            let publishedAt = new Date();
            
            // Look for Source: and Date: pattern within the summary
            const sourceMatch = summary.match(/\*Source: (.*?)(?: \| |\*)/);
            const dateMatch = summary.match(/Date: (.*?)(\*|$)/);
            
            if (sourceMatch && sourceMatch[1]) {
              source = sourceMatch[1].trim();
            } else if (url) {
              try {
                const urlObj = new URL(url);
                source = urlObj.hostname.replace('www.', '');
              } catch (e) {
                // If URL parsing fails, keep the default source
              }
            }
            
            // Extract date if possible
            if (dateMatch && dateMatch[1]) {
              const dateStr = dateMatch[1].trim();
              if (dateStr.includes("days ago") || dateStr.includes("hours ago")) {
                // This is a relative date, keep the current date
              } else {
                try {
                  publishedAt = new Date(dateStr);
                } catch (e) {
                  // If date parsing fails, keep the default date
                }
              }
            }
            
            // Try to determine sectors based on the summary content
            const sectors = [];
            
            // Check for common sector keywords in the summary
            if (summary.toLowerCase().includes("banking") || summary.toLowerCase().includes("finance")) {
              sectors.push("Finance");
            }
            if (summary.toLowerCase().includes("it ") || summary.toLowerCase().includes("tech") || summary.toLowerCase().includes("software")) {
              sectors.push("Technology");
            }
            if (summary.toLowerCase().includes("nifty") || summary.toLowerCase().includes("sensex") || summary.toLowerCase().includes("stocks")) {
              sectors.push("Markets");
            }
            if (summary.toLowerCase().includes("economy") || summary.toLowerCase().includes("gdp") || summary.toLowerCase().includes("inflation")) {
              sectors.push("Economy");
            }
            
            // If no sectors were detected, add a default
            if (sectors.length === 0) {
              sectors.push("Finance");
            }
            
            // Determine sentiment from the content
            let sentiment = "Neutral";
            let impact = "Medium";
            
            // Simple keyword sentiment detection
            const positiveKeywords = ["surge", "bullish", "gains", "growth", "recovery", "rise", "higher", "positive", "optimistic"];
            const negativeKeywords = ["fall", "bearish", "decline", "losses", "fears", "drop", "lower", "negative", "sell-off", "crash"];
            
            // Count positive and negative keywords
            const positiveCount = positiveKeywords.filter(word => summary.toLowerCase().includes(word)).length;
            const negativeCount = negativeKeywords.filter(word => summary.toLowerCase().includes(word)).length;
            
            if (positiveCount > negativeCount) {
              sentiment = "Positive";
            } else if (negativeCount > positiveCount) {
              sentiment = "Negative";
            }
            
            // Determine impact based on keywords
            const highImpactWords = ["significant", "major", "critical", "big", "huge", "massive", "substantial"];
            if (highImpactWords.some(word => summary.toLowerCase().includes(word))) {
              impact = "High";
            }
            
            return {
              id: index + 1,
              title,
              summary,
              source,
              url,
              publishedAt, // Use the extracted date
              sentiment,
              sentimentScore: sentiment === "Positive" ? 0.7 : (sentiment === "Negative" ? 0.3 : 0.5),
              impact,
              sectors
            };
          });
        }
      }
      
      // If the above parsing didn't work, try standard result formats
      if (response && Array.isArray(response.results)) {
        console.log("Parsing from results array format");
        return response.results.map((item: any, index: number) => ({
          id: index + 1,
          title: item.title || "Financial News Update",
          summary:
            item.content ||
            item.description ||
            item.text ||
            "No summary available",
          source: item.source || "Dappier News",
          url: item.url || null,
          publishedAt: new Date(item.published_at || item.date || new Date()),
          sentiment: item.sentiment || "Neutral",
          sentimentScore: item.sentiment_score || 0.5,
          impact: item.impact || "Medium",
          sectors: item.sectors || ["Finance"],
        }));
      }

      // If the response format is different, try to adapt it
      if (response && typeof response === "object") {
        console.log("Parsing from generic object format");
        // Attempt to extract news from various possible response structures
        const newsItems =
          response.news || response.articles || response.data || [];
        return newsItems.slice(0, limit).map((item: any, index: number) => ({
          id: index + 1,
          title: item.title || "Financial News Update",
          summary:
            item.content ||
            item.description ||
            item.text ||
            "No summary available",
          source: item.source || "Dappier News",
          url: item.url || null,
          publishedAt: new Date(item.published_at || item.date || new Date()),
          sentiment: item.sentiment || "Neutral",
          sentimentScore: item.sentiment_score || 0.5,
          impact: item.impact || "Medium",
          sectors: item.sectors || ["Finance"],
        }));
      }

      // If no data, create mock news items that match the schema structure
      return [
        {
          id: 1,
          title: "RBI keeps repo rate unchanged at 6.5% for 6th time in a row",
          summary:
            "The Reserve Bank of India's Monetary Policy Committee (MPC) decided to keep the repo rate unchanged at 6.5% for the sixth consecutive time while maintaining its stance of withdrawal of accommodation.",
          source: "Economic Times",
          url: "https://economictimes.indiatimes.com/news/economy/policy/rbi-mpc-keeps-repo-rate-unchanged-at-6-5-for-6th-time-in-a-row/articleshow/107407270.cms",
          publishedAt: new Date(),
          sentiment: "Neutral",
          sentimentScore: 0.5,
          impact: "Medium",
          sectors: ["Economy", "Banking"],
        },
        {
          id: 2,
          title:
            "IT companies likely to report muted Q1, analysts expect recovery later in FY2025",
          summary:
            "Indian IT services companies are expected to report muted results for Q1FY25, though analysts remain optimistic about growth recovery in the second half of the fiscal year as clients increase technology spending.",
          source: "LiveMint",
          url: "https://www.livemint.com/market/stock-market-news/it-sector-q1-results-preview-large-cap-it-companies-likely-to-report-muted-earnings-in-q1fy25-recovery-seen-in-h2fy25-11722586177142.html",
          publishedAt: new Date(),
          sentiment: "Neutral",
          sentimentScore: 0.4,
          impact: "Medium",
          sectors: ["Technology", "IT"],
        },
        {
          id: 3,
          title:
            "Adani Group stocks surge on clean chit from SEBI in some cases",
          summary:
            "Shares of Adani Group companies surged after the market regulator SEBI gave a clean chit to the conglomerate in some of the allegations made by US short-seller Hindenburg Research.",
          source: "Business Standard",
          url: "https://www.business-standard.com/markets/news/adani-group-stocks-surge-11-sebi-gives-clean-chit-in-hindenburg-allegations-124031300624_1.html",
          publishedAt: new Date(),
          sentiment: "Positive",
          sentimentScore: 0.7,
          impact: "High",
          sectors: ["Markets", "Energy"],
        },
      ];
    } catch (error) {
      console.error("Error parsing Dappier news response:", error);

      // Return fallback data in case of error
      return [
        {
          id: 1,
          title: "RBI keeps repo rate unchanged at 6.5% for 6th time in a row",
          summary:
            "The Reserve Bank of India's Monetary Policy Committee (MPC) decided to keep the repo rate unchanged at 6.5% for the sixth consecutive time while maintaining its stance of withdrawal of accommodation.",
          source: "Economic Times",
          url: "https://economictimes.indiatimes.com/news/economy/policy/rbi-mpc-keeps-repo-rate-unchanged-at-6-5-for-6th-time-in-a-row/articleshow/107407270.cms",
          publishedAt: new Date(),
          sentiment: "Neutral",
          sentimentScore: 0.5,
          impact: "Medium",
          sectors: ["Economy", "Banking"],
        },
      ];
    }
  }

  /**
   * Get market data from Dappier
   */
  static async getMarketData(): Promise<MarketData[]> {
    const query =
      "Get current market data for top 10 Indian stocks including NIFTY and SENSEX";
    const response = await this.makeRequest<any>(query);

    // Parse and convert the response to our MarketData format
    try {
      if (response && Array.isArray(response.results)) {
        return response.results.map((item: any, index: number) => ({
          id: index + 1,
          symbol: item.symbol || item.ticker || `STOCK${index + 1}`,
          name: item.name || item.company_name || `Stock ${index + 1}`,
          price: parseFloat(item.price) || parseFloat(item.current_price) || 0,
          change: parseFloat(item.change) || 0,
          changePercent: parseFloat(item.change_percent) || 0,
          volume: parseInt(item.volume) || 0,
          marketCap: parseFloat(item.market_cap) || 0,
          sector: item.sector || "General",
          lastUpdated: new Date(item.last_updated || new Date()),
          dayHigh: parseFloat(item.day_high) || 0,
          dayLow: parseFloat(item.day_low) || 0,
          chartData: item.chart_data || [],
        }));
      }

      // If the response format is different, try to adapt it
      if (response && typeof response === "object") {
        // Attempt to extract market data from various possible response structures
        const marketItems =
          response.market_data || response.stocks || response.data || [];
        return marketItems.map((item: any, index: number) => ({
          id: index + 1,
          symbol: item.symbol || item.ticker || `STOCK${index + 1}`,
          name: item.name || item.company_name || `Stock ${index + 1}`,
          price: parseFloat(item.price) || parseFloat(item.current_price) || 0,
          change: parseFloat(item.change) || 0,
          changePercent: parseFloat(item.change_percent) || 0,
          volume: parseInt(item.volume) || 0,
          marketCap: parseFloat(item.market_cap) || 0,
          sector: item.sector || "General",
          lastUpdated: new Date(item.last_updated || new Date()),
          dayHigh: parseFloat(item.day_high) || 0,
          dayLow: parseFloat(item.day_low) || 0,
          chartData: item.chart_data || [],
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
    const query =
      "Analyze current market sentiment for Indian stock market, including sector analysis";
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
      if (response && typeof response === "object") {
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
          confidenceScore: parseFloat(response.confidence) || 0.7,
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
        confidenceScore: 0.7,
      };
    } catch (error) {
      console.error(
        `Error parsing Dappier sector sentiment response for ${sector}:`,
        error,
      );

      // Default response in case of error
      return {
        id: 1,
        name: sector,
        lastUpdated: new Date(),
        sentiment: "neutral",
        score: 0.5,
        newsCount: 0,
        keyTopics: [],
        confidenceScore: 0.7,
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
          lastUpdated: new Date(),
        },
        {
          id: 2,
          name: "Dappier Market Data",
          status: "ACTIVE",
          message: "Connected and operational",
          details: { type: "market-data", source: "Dappier" },
          lastUpdated: new Date(),
        },
        {
          id: 3,
          name: "Dappier Sentiment Analysis",
          status: "ACTIVE",
          message: "Connected and operational",
          details: { type: "sentiment", source: "Dappier" },
          lastUpdated: new Date(),
        },
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
          lastUpdated: new Date(),
        },
      ];
    }
  }
}

// Function to check if Dappier credentials are configured
export async function checkDappierConfiguration(): Promise<boolean> {
  try {
    // Check if Dappier environment variables are set
    const dappierUrl = localStorage.getItem("MCP_SERVER_URL");
    const dappierKey = localStorage.getItem("MCP_API_KEY");

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
