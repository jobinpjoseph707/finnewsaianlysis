import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { 
  strategyRepository, 
  sentimentAnalyzer, 
  marketDataService, 
  getMCPStatus 
} from "./mcp";
import { insertStrategySchema } from "../shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // MCP API Routes (in-memory storage only)

  // MCP Market Data API
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
