import { pgTable, text, serial, integer, boolean, jsonb, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name"),
  email: text("email"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  email: true,
});

// Market data schema
export const marketData = pgTable("market_data", {
  id: serial("id").primaryKey(),
  symbol: text("symbol").notNull(),
  name: text("name").notNull(),
  value: real("value").notNull(),
  change: real("change").notNull(),
  changePercent: real("change_percent").notNull(),
  lastUpdated: timestamp("last_updated").notNull().defaultNow(),
  data: jsonb("data"),
});

export const insertMarketDataSchema = createInsertSchema(marketData).pick({
  symbol: true,
  name: true,
  value: true,
  change: true,
  changePercent: true,
  data: true,
});

// Strategy schema
export const strategies = pgTable("strategies", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  confidenceLevel: text("confidence_level").notNull(), // High, Medium, Speculative
  riskLevel: text("risk_level").notNull(), // Low, Medium, High
  timeHorizon: text("time_horizon").notNull(),
  expectedReturn: text("expected_return").notNull(),
  sectors: jsonb("sectors").notNull(),
  generatedAt: timestamp("generated_at").notNull().defaultNow(),
  performance: real("performance"),
  status: text("status").notNull().default("active"),
  context: jsonb("context"),
});

export const insertStrategySchema = createInsertSchema(strategies).pick({
  title: true,
  description: true,
  confidenceLevel: true,
  riskLevel: true,
  timeHorizon: true,
  expectedReturn: true,
  sectors: true,
  context: true,
});

// News schema
export const news = pgTable("news", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  summary: text("summary").notNull(),
  source: text("source").notNull(),
  url: text("url"),
  publishedAt: timestamp("published_at").notNull(),
  sentiment: text("sentiment").notNull(), // Positive, Negative, Neutral
  sentimentScore: real("sentiment_score"),
  impact: text("impact").notNull(), // High, Medium, Low
  sectors: jsonb("sectors"),
});

export const insertNewsSchema = createInsertSchema(news).pick({
  title: true,
  summary: true,
  source: true,
  url: true,
  publishedAt: true,
  sentiment: true,
  sentimentScore: true,
  impact: true,
  sectors: true,
});

// Sector sentiment schema
export const sectorSentiment = pgTable("sector_sentiment", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  sentiment: text("sentiment").notNull(), 
  score: real("score").notNull(),
  lastUpdated: timestamp("last_updated").notNull().defaultNow(),
});

export const insertSectorSentimentSchema = createInsertSchema(sectorSentiment).pick({
  name: true,
  sentiment: true,
  score: true,
});

// MCP Status schema
export const mcpStatus = pgTable("mcp_status", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  status: text("status").notNull(),
  message: text("message"),
  details: jsonb("details"),
  lastUpdated: timestamp("last_updated").notNull().defaultNow(),
});

export const insertMcpStatusSchema = createInsertSchema(mcpStatus).pick({
  name: true,
  status: true,
  message: true,
  details: true,
});

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type MarketData = typeof marketData.$inferSelect;
export type InsertMarketData = z.infer<typeof insertMarketDataSchema>;

export type Strategy = typeof strategies.$inferSelect;
export type InsertStrategy = z.infer<typeof insertStrategySchema>;

export type News = typeof news.$inferSelect;
export type InsertNews = z.infer<typeof insertNewsSchema>;

export type SectorSentiment = typeof sectorSentiment.$inferSelect;
export type InsertSectorSentiment = z.infer<typeof insertSectorSentimentSchema>;

export type McpStatus = typeof mcpStatus.$inferSelect;
export type InsertMcpStatus = z.infer<typeof insertMcpStatusSchema>;
