import { 
  users, 
  type User, 
  type InsertUser,
  strategies,
  type Strategy,
  type InsertStrategy,
  marketData,
  type MarketData,
  type InsertMarketData,
  news,
  type News,
  type InsertNews,
  sectorSentiment,
  type SectorSentiment,
  type InsertSectorSentiment,
  mcpStatus,
  type McpStatus,
  type InsertMcpStatus 
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

// Core interface for user-related storage operations
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Strategy methods
  getStrategy(id: number): Promise<Strategy | undefined>;
  getAllStrategies(): Promise<Strategy[]>;
  createStrategy(strategy: InsertStrategy): Promise<Strategy>;
  updateStrategy(id: number, strategy: Partial<Strategy>): Promise<Strategy | undefined>;
  
  // Market data methods
  getMarketData(id: number): Promise<MarketData | undefined>;
  getMarketDataBySymbol(symbol: string): Promise<MarketData | undefined>;
  getAllMarketData(): Promise<MarketData[]>;
  createMarketData(marketData: InsertMarketData): Promise<MarketData>;
  updateMarketData(id: number, marketData: Partial<MarketData>): Promise<MarketData | undefined>;
  
  // News methods
  getNews(id: number): Promise<News | undefined>;
  getAllNews(): Promise<News[]>;
  createNews(news: InsertNews): Promise<News>;
  
  // Sector sentiment methods
  getSectorSentiment(id: number): Promise<SectorSentiment | undefined>;
  getSectorSentimentByName(name: string): Promise<SectorSentiment | undefined>;
  getAllSectorSentiments(): Promise<SectorSentiment[]>;
  createSectorSentiment(sentiment: InsertSectorSentiment): Promise<SectorSentiment>;
  updateSectorSentiment(id: number, sentiment: Partial<SectorSentiment>): Promise<SectorSentiment | undefined>;
  
  // MCP Status methods
  getMcpStatus(id: number): Promise<McpStatus | undefined>;
  getMcpStatusByName(name: string): Promise<McpStatus | undefined>;
  getAllMcpStatus(): Promise<McpStatus[]>;
  createMcpStatus(status: InsertMcpStatus): Promise<McpStatus>;
  updateMcpStatus(id: number, status: Partial<McpStatus>): Promise<McpStatus | undefined>;
}

// DatabaseStorage implementation that uses PostgreSQL
export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  
  // Strategy methods
  async getStrategy(id: number): Promise<Strategy | undefined> {
    const [strategy] = await db.select().from(strategies).where(eq(strategies.id, id));
    return strategy;
  }
  
  async getAllStrategies(): Promise<Strategy[]> {
    return await db.select().from(strategies);
  }
  
  async createStrategy(strategy: InsertStrategy): Promise<Strategy> {
    const [newStrategy] = await db.insert(strategies).values(strategy).returning();
    return newStrategy;
  }
  
  async updateStrategy(id: number, strategyUpdate: Partial<Strategy>): Promise<Strategy | undefined> {
    const [updatedStrategy] = await db
      .update(strategies)
      .set({ ...strategyUpdate, ...{ lastUpdated: new Date() } })
      .where(eq(strategies.id, id))
      .returning();
    return updatedStrategy;
  }
  
  // Market data methods
  async getMarketData(id: number): Promise<MarketData | undefined> {
    const [data] = await db.select().from(marketData).where(eq(marketData.id, id));
    return data;
  }
  
  async getMarketDataBySymbol(symbol: string): Promise<MarketData | undefined> {
    const [data] = await db.select().from(marketData).where(eq(marketData.symbol, symbol));
    return data;
  }
  
  async getAllMarketData(): Promise<MarketData[]> {
    return await db.select().from(marketData);
  }
  
  async createMarketData(data: InsertMarketData): Promise<MarketData> {
    const [newData] = await db.insert(marketData).values(data).returning();
    return newData;
  }
  
  async updateMarketData(id: number, dataUpdate: Partial<MarketData>): Promise<MarketData | undefined> {
    const [updatedData] = await db
      .update(marketData)
      .set({ ...dataUpdate, lastUpdated: new Date() })
      .where(eq(marketData.id, id))
      .returning();
    return updatedData;
  }
  
  // News methods
  async getNews(id: number): Promise<News | undefined> {
    const [newsItem] = await db.select().from(news).where(eq(news.id, id));
    return newsItem;
  }
  
  async getAllNews(): Promise<News[]> {
    return await db.select().from(news);
  }
  
  async createNews(newsItem: InsertNews): Promise<News> {
    const [newNews] = await db.insert(news).values(newsItem).returning();
    return newNews;
  }
  
  // Sector sentiment methods
  async getSectorSentiment(id: number): Promise<SectorSentiment | undefined> {
    const [sentiment] = await db.select().from(sectorSentiment).where(eq(sectorSentiment.id, id));
    return sentiment;
  }
  
  async getSectorSentimentByName(name: string): Promise<SectorSentiment | undefined> {
    const [sentiment] = await db.select().from(sectorSentiment).where(eq(sectorSentiment.name, name));
    return sentiment;
  }
  
  async getAllSectorSentiments(): Promise<SectorSentiment[]> {
    return await db.select().from(sectorSentiment);
  }
  
  async createSectorSentiment(sentiment: InsertSectorSentiment): Promise<SectorSentiment> {
    const [newSentiment] = await db.insert(sectorSentiment).values(sentiment).returning();
    return newSentiment;
  }
  
  async updateSectorSentiment(id: number, sentimentUpdate: Partial<SectorSentiment>): Promise<SectorSentiment | undefined> {
    const [updatedSentiment] = await db
      .update(sectorSentiment)
      .set({ ...sentimentUpdate, lastUpdated: new Date() })
      .where(eq(sectorSentiment.id, id))
      .returning();
    return updatedSentiment;
  }
  
  // MCP Status methods
  async getMcpStatus(id: number): Promise<McpStatus | undefined> {
    const [status] = await db.select().from(mcpStatus).where(eq(mcpStatus.id, id));
    return status;
  }
  
  async getMcpStatusByName(name: string): Promise<McpStatus | undefined> {
    const [status] = await db.select().from(mcpStatus).where(eq(mcpStatus.name, name));
    return status;
  }
  
  async getAllMcpStatus(): Promise<McpStatus[]> {
    return await db.select().from(mcpStatus);
  }
  
  async createMcpStatus(status: InsertMcpStatus): Promise<McpStatus> {
    const [newStatus] = await db.insert(mcpStatus).values(status).returning();
    return newStatus;
  }
  
  async updateMcpStatus(id: number, statusUpdate: Partial<McpStatus>): Promise<McpStatus | undefined> {
    const [updatedStatus] = await db
      .update(mcpStatus)
      .set({ ...statusUpdate, lastUpdated: new Date() })
      .where(eq(mcpStatus.id, id))
      .returning();
    return updatedStatus;
  }
}

// Use DatabaseStorage instead of MemStorage
export const storage = new DatabaseStorage();
