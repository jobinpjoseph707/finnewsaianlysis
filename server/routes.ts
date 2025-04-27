import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { 
  insertStrategySchema, 
  insertMarketDataSchema, 
  insertNewsSchema, 
  insertSectorSentimentSchema,
  insertMcpStatusSchema
} from "@shared/schema";
import { 
  strategyRepository, 
  sentimentAnalyzer, 
  marketDataService, 
  getMCPStatus 
} from "./mcp";

export async function registerRoutes(app: Express): Promise<Server> {
  // Regular API routes (backed by database storage)
  
  // Market Data API
  app.get("/api/market-data", async (req, res) => {
    try {
      const data = await marketDataService.getMarketData();
      res.json(data);
    } catch (error) {
      console.error("Error fetching market data:", error);
      res.status(500).json({ message: "Failed to fetch market data" });
    }
  });
  
  app.get("/api/market-data/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const data = await storage.getMarketData(id);
      
      if (!data) {
        return res.status(404).json({ message: `Market data with ID ${id} not found` });
      }
      
      res.json(data);
    } catch (error) {
      console.error(`Error fetching market data ${req.params.id}:`, error);
      res.status(500).json({ message: "Failed to fetch market data" });
    }
  });
  
  app.get("/api/market-data/symbol/:symbol", async (req, res) => {
    try {
      const symbol = req.params.symbol;
      const data = await marketDataService.getMarketDataBySymbol(symbol);
      
      if (!data) {
        return res.status(404).json({ message: `Market data for ${symbol} not found` });
      }
      
      res.json(data);
    } catch (error) {
      console.error(`Error fetching market data for ${req.params.symbol}:`, error);
      res.status(500).json({ message: "Failed to fetch market data" });
    }
  });
  
  app.post("/api/market-data", async (req, res) => {
    try {
      const validatedData = insertMarketDataSchema.parse(req.body);
      const newData = await storage.createMarketData(validatedData);
      res.status(201).json(newData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      
      console.error("Error creating market data:", error);
      res.status(500).json({ message: "Failed to create market data" });
    }
  });
  
  // Strategies API
  app.get("/api/strategies", async (req, res) => {
    try {
      const strategies = await storage.getAllStrategies();
      res.json(strategies);
    } catch (error) {
      console.error("Error fetching strategies:", error);
      res.status(500).json({ message: "Failed to fetch strategies" });
    }
  });
  
  app.get("/api/strategies/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const strategy = await storage.getStrategy(id);
      
      if (!strategy) {
        return res.status(404).json({ message: `Strategy with ID ${id} not found` });
      }
      
      res.json(strategy);
    } catch (error) {
      console.error(`Error fetching strategy ${req.params.id}:`, error);
      res.status(500).json({ message: "Failed to fetch strategy" });
    }
  });
  
  app.post("/api/strategies", async (req, res) => {
    try {
      const validatedData = insertStrategySchema.parse(req.body);
      const newStrategy = await storage.createStrategy(validatedData);
      res.status(201).json(newStrategy);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      
      console.error("Error creating strategy:", error);
      res.status(500).json({ message: "Failed to create strategy" });
    }
  });
  
  app.patch("/api/strategies/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const updatedStrategy = await storage.updateStrategy(id, req.body);
      
      if (!updatedStrategy) {
        return res.status(404).json({ message: `Strategy with ID ${id} not found` });
      }
      
      res.json(updatedStrategy);
    } catch (error) {
      console.error(`Error updating strategy ${req.params.id}:`, error);
      res.status(500).json({ message: "Failed to update strategy" });
    }
  });
  
  // News API
  app.get("/api/news", async (req, res) => {
    try {
      const news = await storage.getAllNews();
      res.json(news);
    } catch (error) {
      console.error("Error fetching news:", error);
      res.status(500).json({ message: "Failed to fetch news" });
    }
  });
  
  app.get("/api/news/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const newsItem = await storage.getNews(id);
      
      if (!newsItem) {
        return res.status(404).json({ message: `News with ID ${id} not found` });
      }
      
      res.json(newsItem);
    } catch (error) {
      console.error(`Error fetching news ${req.params.id}:`, error);
      res.status(500).json({ message: "Failed to fetch news" });
    }
  });
  
  // Sentiment API
  app.get("/api/sentiment", async (req, res) => {
    try {
      const sectorSentiments = await storage.getAllSectorSentiments();
      const news = await storage.getAllNews();
      
      // Construct sentiment data object similar to MCP structure
      const sentimentData = {
        overall: {
          score: sectorSentiments.reduce((avg, curr) => avg + curr.score, 0) / 
                 (sectorSentiments.length || 1),
          trend: "stable"
        },
        sectors: sectorSentiments,
        news: news.slice(0, 5), // Latest 5 news items
        sourceCount: 10 // Placeholder
      };
      
      res.json(sentimentData);
    } catch (error) {
      console.error("Error fetching sentiment data:", error);
      res.status(500).json({ message: "Failed to fetch sentiment data" });
    }
  });
  
  app.get("/api/sentiment/sector/:name", async (req, res) => {
    try {
      const name = req.params.name;
      const sentiment = await storage.getSectorSentimentByName(name);
      
      if (!sentiment) {
        return res.status(404).json({ message: `Sentiment for sector ${name} not found` });
      }
      
      res.json(sentiment);
    } catch (error) {
      console.error(`Error fetching sentiment for sector ${req.params.name}:`, error);
      res.status(500).json({ message: "Failed to fetch sector sentiment" });
    }
  });
  
  // MCP Status API
  app.get("/api/mcp-status", async (req, res) => {
    try {
      const status = await storage.getAllMcpStatus();
      res.json(status);
    } catch (error) {
      console.error("Error fetching MCP status:", error);
      res.status(500).json({ message: "Failed to fetch MCP status" });
    }
  });

  // MCP API Routes (in-memory storage)
  // MCP Market Data API
  app.get("/api/mcp/market-data", (req, res) => {
    try {
      const data = marketDataService.getMarketData();
      res.json(data);
    } catch (error) {
      console.error("Error fetching market data:", error);
      res.status(500).json({ message: "Failed to fetch market data" });
    }
  });

  app.get("/api/mcp/market-data/:symbol", (req, res) => {
    try {
      const symbol = req.params.symbol;
      const data = marketDataService.getMarketDataBySymbol(symbol);
      
      if (!data) {
        return res.status(404).json({ message: `Market data for ${symbol} not found` });
      }
      
      res.json(data);
    } catch (error) {
      console.error(`Error fetching market data for ${req.params.symbol}:`, error);
      res.status(500).json({ message: "Failed to fetch market data" });
    }
  });

  // MCP Strategy API
  app.get("/api/mcp/strategies", (req, res) => {
    try {
      const strategies = strategyRepository.getStrategies();
      res.json(strategies);
    } catch (error) {
      console.error("Error fetching strategies:", error);
      res.status(500).json({ message: "Failed to fetch strategies" });
    }
  });

  app.get("/api/mcp/strategies/:id", (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const strategy = strategyRepository.getStrategyById(id);
      
      if (!strategy) {
        return res.status(404).json({ message: `Strategy with ID ${id} not found` });
      }
      
      res.json(strategy);
    } catch (error) {
      console.error(`Error fetching strategy ${req.params.id}:`, error);
      res.status(500).json({ message: "Failed to fetch strategy" });
    }
  });

  app.post("/api/mcp/strategies", (req, res) => {
    try {
      const validatedData = insertStrategySchema.parse(req.body);
      const newStrategy = strategyRepository.createStrategy(validatedData);
      res.status(201).json(newStrategy);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      
      console.error("Error creating strategy:", error);
      res.status(500).json({ message: "Failed to create strategy" });
    }
  });

  app.patch("/api/mcp/strategies/:id", (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const updatedStrategy = strategyRepository.updateStrategy(id, req.body);
      
      if (!updatedStrategy) {
        return res.status(404).json({ message: `Strategy with ID ${id} not found` });
      }
      
      res.json(updatedStrategy);
    } catch (error) {
      console.error(`Error updating strategy ${req.params.id}:`, error);
      res.status(500).json({ message: "Failed to update strategy" });
    }
  });

  // MCP Sentiment Analysis API
  app.get("/api/mcp/sentiment", (req, res) => {
    try {
      const sentimentData = sentimentAnalyzer.getSentimentData();
      res.json(sentimentData);
    } catch (error) {
      console.error("Error fetching sentiment data:", error);
      res.status(500).json({ message: "Failed to fetch sentiment data" });
    }
  });

  // MCP Performance Tracking API
  app.get("/api/mcp/performance", (req, res) => {
    try {
      const performanceData = {
        successRate: "76%",
        avgReturn: "+12.4%",
        activeStrategies: strategyRepository.getActiveStrategyCount(),
        topPerforming: strategyRepository.getTopPerformingStrategies()
      };
      
      res.json(performanceData);
    } catch (error) {
      console.error("Error fetching performance data:", error);
      res.status(500).json({ message: "Failed to fetch performance data" });
    }
  });

  // MCP System Status API
  app.get("/api/mcp/status", (req, res) => {
    try {
      const statusData = getMCPStatus();
      res.json(statusData);
    } catch (error) {
      console.error("Error fetching MCP status:", error);
      res.status(500).json({ message: "Failed to fetch MCP status" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
