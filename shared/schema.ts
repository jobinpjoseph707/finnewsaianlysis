// Removed drizzle-zod import. Only using zod for validation now.
import { z } from "zod";
// Import schema helpers (replace with your ORM's helpers as needed)
import {
  pgTable,
  serial,
  integer,
  text,
  real,
  boolean,
  timestamp,
  jsonb,
  relations,
  one,
  many
} from "./schema-helpers";

// All previous drizzle-orm schema code has been removed. Add your new schema/model definitions below using your preferred ORM or approach.

// User schema (define this if not already defined)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
});

export const insertUserSchema = z.object({
  username: z.string(),
  password: z.string(),
  name: z.string(),
  email: z.string().email(),
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

// Removed: marketDataRelations definition using relations(), since Drizzle ORM is no longer in use and this caused an argument mismatch and ReferenceError.

export const insertMarketDataSchema = z.object({
  symbol: z.string(),
  name: z.string(),
  value: z.number(),
  change: z.number(),
  changePercent: z.number(),
  data: z.any().optional()
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

// Removed: strategiesRelations definition using relations(), since Drizzle ORM is no longer in use and this caused an argument mismatch error.

export const insertStrategySchema = z.object({
  title: z.string(),
  description: z.string(),
  confidenceLevel: z.string(),
  riskLevel: z.string(),
  timeHorizon: z.string(),
  expectedReturn: z.string(),
  sectors: z.any(),
  context: z.any().optional(),
});

// User-Strategy relation (for saved or followed strategies)
export const userStrategies = pgTable("user_strategies", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  strategyId: integer("strategy_id").notNull().references(() => strategies.id, { onDelete: 'cascade' }),
  isSaved: boolean("is_saved").notNull().default(false),
  isFollowing: boolean("is_following").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type RelationHelpers = { one: typeof one; many: typeof many };

export const userStrategiesRelations = relations(userStrategies, ({ one }: RelationHelpers) => ({
  user: one(users, {
    fields: [userStrategies.userId],
    references: [users.id],
  }),
  strategy: one(strategies, {
    fields: [userStrategies.strategyId],
    references: [strategies.id],
  }),
}));

export const insertUserStrategySchema = z.object({
  userId: z.number(),
  strategyId: z.number(),
  isSaved: z.boolean().optional(),
  isFollowing: z.boolean().optional(),
});

// Strategy-MarketData relation (to track which market data influenced a strategy)
export const strategyMarketData = pgTable("strategy_market_data", {
  id: serial("id").primaryKey(),
  strategyId: integer("strategy_id").notNull().references(() => strategies.id, { onDelete: 'cascade' }),
  marketDataId: integer("market_data_id").notNull().references(() => marketData.id, { onDelete: 'cascade' }),
  influence: real("influence").notNull(), // How much this market data influenced the strategy (0-100%)
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const strategyMarketDataRelations = relations(strategyMarketData, ({ one }: RelationHelpers) => ({
  strategy: one(strategies, {
    fields: [strategyMarketData.strategyId],
    references: [strategies.id],
  }),
  marketData: one(marketData, {
    fields: [strategyMarketData.marketDataId],
    references: [marketData.id],
  }),
}));

export const insertStrategyMarketDataSchema = z.object({
  strategyId: z.number(),
  marketDataId: z.number(),
  influence: z.number(),
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

// Removed: newsRelations definition using relations(), since Drizzle ORM is no longer in use and this caused an argument mismatch and ReferenceError.

export const insertNewsSchema = z.object({
  title: z.string(),
  summary: z.string(),
  source: z.string(),
  url: z.string().optional(),
  publishedAt: z.any(),
  sentiment: z.string(),
  sentimentScore: z.number().optional(),
  impact: z.string(),
  sectors: z.any().optional(),
});

// Strategy-News relation (to track which news influenced a strategy)
export const strategyNews = pgTable("strategy_news", {
  id: serial("id").primaryKey(),
  strategyId: integer("strategy_id").notNull().references(() => strategies.id, { onDelete: 'cascade' }),
  newsId: integer("news_id").notNull().references(() => news.id, { onDelete: 'cascade' }),
  influence: real("influence").notNull(), // How much this news influenced the strategy (0-100%)
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const strategyNewsRelations = relations(strategyNews, ({ one }: RelationHelpers) => ({
  strategy: one(strategies, {
    fields: [strategyNews.strategyId],
    references: [strategies.id],
  }),
  news: one(news, {
    fields: [strategyNews.newsId],
    references: [news.id],
  }),
}));

export const insertStrategyNewsSchema = z.object({
  strategyId: z.number(),
  newsId: z.number(),
  influence: z.number(),
});

// Sector sentiment schema
export const sectorSentiment = pgTable("sector_sentiment", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  sentiment: text("sentiment").notNull(), 
  score: real("score").notNull(),
  newsCount: integer("news_count").default(0),
  keyTopics: jsonb("key_topics").default([]),
  confidenceScore: real("confidence_score").default(0.7),
  lastUpdated: timestamp("last_updated").notNull().defaultNow(),
});

export const insertSectorSentimentSchema = z.object({
  name: z.string(),
  sentiment: z.string(),
  score: z.number(),
  newsCount: z.number().optional(),
  keyTopics: z.any().optional(),
  confidenceScore: z.number().optional(),
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

export const insertMcpStatusSchema = z.object({
  name: z.string(),
  status: z.string(),
  message: z.string().optional(),
  details: z.any().optional(),
});

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type MarketData = typeof marketData.$inferSelect;
export type InsertMarketData = z.infer<typeof insertMarketDataSchema>;

export type Strategy = typeof strategies.$inferSelect;
export type InsertStrategy = z.infer<typeof insertStrategySchema>;

export type UserStrategy = typeof userStrategies.$inferSelect;
export type InsertUserStrategy = z.infer<typeof insertUserStrategySchema>;

export type StrategyMarketData = typeof strategyMarketData.$inferSelect;
export type InsertStrategyMarketData = z.infer<typeof insertStrategyMarketDataSchema>;

export type News = typeof news.$inferSelect;
export type InsertNews = z.infer<typeof insertNewsSchema>;

export type StrategyNews = typeof strategyNews.$inferSelect;
export type InsertStrategyNews = z.infer<typeof insertStrategyNewsSchema>;

export type SectorSentiment = typeof sectorSentiment.$inferSelect;
export type InsertSectorSentiment = z.infer<typeof insertSectorSentimentSchema>;

export type McpStatus = typeof mcpStatus.$inferSelect;
export type InsertMcpStatus = z.infer<typeof insertMcpStatusSchema>;
