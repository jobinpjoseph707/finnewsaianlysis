import { pgTable, text, serial, integer, boolean, jsonb, timestamp, real, foreignKey } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name"),
  email: text("email"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  strategies: many(userStrategies),
}));

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

export const marketDataRelations = relations(marketData, ({ many }) => ({
  strategyMarketData: many(strategyMarketData),
}));

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

export const strategiesRelations = relations(strategies, ({ many }) => ({
  userStrategies: many(userStrategies),
  strategyMarketData: many(strategyMarketData),
  strategyNews: many(strategyNews),
}));

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

// User-Strategy relation (for saved or followed strategies)
export const userStrategies = pgTable("user_strategies", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  strategyId: integer("strategy_id").notNull().references(() => strategies.id, { onDelete: 'cascade' }),
  isSaved: boolean("is_saved").notNull().default(false),
  isFollowing: boolean("is_following").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const userStrategiesRelations = relations(userStrategies, ({ one }) => ({
  user: one(users, {
    fields: [userStrategies.userId],
    references: [users.id],
  }),
  strategy: one(strategies, {
    fields: [userStrategies.strategyId],
    references: [strategies.id],
  }),
}));

export const insertUserStrategySchema = createInsertSchema(userStrategies).pick({
  userId: true,
  strategyId: true,
  isSaved: true,
  isFollowing: true,
});

// Strategy-MarketData relation (to track which market data influenced a strategy)
export const strategyMarketData = pgTable("strategy_market_data", {
  id: serial("id").primaryKey(),
  strategyId: integer("strategy_id").notNull().references(() => strategies.id, { onDelete: 'cascade' }),
  marketDataId: integer("market_data_id").notNull().references(() => marketData.id, { onDelete: 'cascade' }),
  influence: real("influence").notNull(), // How much this market data influenced the strategy (0-100%)
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const strategyMarketDataRelations = relations(strategyMarketData, ({ one }) => ({
  strategy: one(strategies, {
    fields: [strategyMarketData.strategyId],
    references: [strategies.id],
  }),
  marketData: one(marketData, {
    fields: [strategyMarketData.marketDataId],
    references: [marketData.id],
  }),
}));

export const insertStrategyMarketDataSchema = createInsertSchema(strategyMarketData).pick({
  strategyId: true,
  marketDataId: true,
  influence: true,
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

export const newsRelations = relations(news, ({ many }) => ({
  strategyNews: many(strategyNews),
}));

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

// Strategy-News relation (to track which news influenced a strategy)
export const strategyNews = pgTable("strategy_news", {
  id: serial("id").primaryKey(),
  strategyId: integer("strategy_id").notNull().references(() => strategies.id, { onDelete: 'cascade' }),
  newsId: integer("news_id").notNull().references(() => news.id, { onDelete: 'cascade' }),
  influence: real("influence").notNull(), // How much this news influenced the strategy (0-100%)
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const strategyNewsRelations = relations(strategyNews, ({ one }) => ({
  strategy: one(strategies, {
    fields: [strategyNews.strategyId],
    references: [strategies.id],
  }),
  news: one(news, {
    fields: [strategyNews.newsId],
    references: [news.id],
  }),
}));

export const insertStrategyNewsSchema = createInsertSchema(strategyNews).pick({
  strategyId: true,
  newsId: true,
  influence: true,
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

export const insertSectorSentimentSchema = createInsertSchema(sectorSentiment).pick({
  name: true,
  sentiment: true,
  score: true,
  newsCount: true,
  keyTopics: true,
  confidenceScore: true,
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
