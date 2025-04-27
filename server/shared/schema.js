"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertMcpStatusSchema = exports.mcpStatus = exports.insertSectorSentimentSchema = exports.sectorSentiment = exports.insertStrategyNewsSchema = exports.strategyNewsRelations = exports.strategyNews = exports.insertNewsSchema = exports.newsRelations = exports.news = exports.insertStrategyMarketDataSchema = exports.strategyMarketDataRelations = exports.strategyMarketData = exports.insertUserStrategySchema = exports.userStrategiesRelations = exports.userStrategies = exports.insertStrategySchema = exports.strategiesRelations = exports.strategies = exports.insertMarketDataSchema = exports.marketDataRelations = exports.marketData = exports.insertUserSchema = exports.usersRelations = exports.users = void 0;
// var pg_core_1 = require("drizzle-orm/pg-core"); // REMOVED: drizzle-orm no longer used
// var drizzle_orm_1 = require("drizzle-orm"); // REMOVED: drizzle-orm no longer used
var drizzle_zod_1 = require("drizzle-zod");
// User schema
exports.users = (0, pg_core_1.pgTable)("users", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    username: (0, pg_core_1.text)("username").notNull().unique(),
    password: (0, pg_core_1.text)("password").notNull(),
    name: (0, pg_core_1.text)("name"),
    email: (0, pg_core_1.text)("email"),
    createdAt: (0, pg_core_1.timestamp)("created_at").notNull().defaultNow(),
});
exports.usersRelations = (0, drizzle_orm_1.relations)(exports.users, function (_a) {
    var many = _a.many;
    return ({
        strategies: many(exports.userStrategies),
    });
});
exports.insertUserSchema = (0, drizzle_zod_1.createInsertSchema)(exports.users).pick({
    username: true,
    password: true,
    name: true,
    email: true,
});
// Market data schema
exports.marketData = (0, pg_core_1.pgTable)("market_data", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    symbol: (0, pg_core_1.text)("symbol").notNull(),
    name: (0, pg_core_1.text)("name").notNull(),
    value: (0, pg_core_1.real)("value").notNull(),
    change: (0, pg_core_1.real)("change").notNull(),
    changePercent: (0, pg_core_1.real)("change_percent").notNull(),
    lastUpdated: (0, pg_core_1.timestamp)("last_updated").notNull().defaultNow(),
    data: (0, pg_core_1.jsonb)("data"),
});
exports.marketDataRelations = (0, drizzle_orm_1.relations)(exports.marketData, function (_a) {
    var many = _a.many;
    return ({
        strategyMarketData: many(exports.strategyMarketData),
    });
});
exports.insertMarketDataSchema = (0, drizzle_zod_1.createInsertSchema)(exports.marketData).pick({
    symbol: true,
    name: true,
    value: true,
    change: true,
    changePercent: true,
    data: true,
});
// Strategy schema
exports.strategies = (0, pg_core_1.pgTable)("strategies", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    title: (0, pg_core_1.text)("title").notNull(),
    description: (0, pg_core_1.text)("description").notNull(),
    confidenceLevel: (0, pg_core_1.text)("confidence_level").notNull(), // High, Medium, Speculative
    riskLevel: (0, pg_core_1.text)("risk_level").notNull(), // Low, Medium, High
    timeHorizon: (0, pg_core_1.text)("time_horizon").notNull(),
    expectedReturn: (0, pg_core_1.text)("expected_return").notNull(),
    sectors: (0, pg_core_1.jsonb)("sectors").notNull(),
    generatedAt: (0, pg_core_1.timestamp)("generated_at").notNull().defaultNow(),
    performance: (0, pg_core_1.real)("performance"),
    status: (0, pg_core_1.text)("status").notNull().default("active"),
    context: (0, pg_core_1.jsonb)("context"),
});
exports.strategiesRelations = (0, drizzle_orm_1.relations)(exports.strategies, function (_a) {
    var many = _a.many;
    return ({
        userStrategies: many(exports.userStrategies),
        strategyMarketData: many(exports.strategyMarketData),
        strategyNews: many(exports.strategyNews),
    });
});
exports.insertStrategySchema = (0, drizzle_zod_1.createInsertSchema)(exports.strategies).pick({
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
exports.userStrategies = (0, pg_core_1.pgTable)("user_strategies", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    userId: (0, pg_core_1.integer)("user_id").notNull().references(function () { return exports.users.id; }, { onDelete: 'cascade' }),
    strategyId: (0, pg_core_1.integer)("strategy_id").notNull().references(function () { return exports.strategies.id; }, { onDelete: 'cascade' }),
    isSaved: (0, pg_core_1.boolean)("is_saved").notNull().default(false),
    isFollowing: (0, pg_core_1.boolean)("is_following").notNull().default(false),
    createdAt: (0, pg_core_1.timestamp)("created_at").notNull().defaultNow(),
});
exports.userStrategiesRelations = (0, drizzle_orm_1.relations)(exports.userStrategies, function (_a) {
    var one = _a.one;
    return ({
        user: one(exports.users, {
            fields: [exports.userStrategies.userId],
            references: [exports.users.id],
        }),
        strategy: one(exports.strategies, {
            fields: [exports.userStrategies.strategyId],
            references: [exports.strategies.id],
        }),
    });
});
exports.insertUserStrategySchema = (0, drizzle_zod_1.createInsertSchema)(exports.userStrategies).pick({
    userId: true,
    strategyId: true,
    isSaved: true,
    isFollowing: true,
});
// Strategy-MarketData relation (to track which market data influenced a strategy)
exports.strategyMarketData = (0, pg_core_1.pgTable)("strategy_market_data", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    strategyId: (0, pg_core_1.integer)("strategy_id").notNull().references(function () { return exports.strategies.id; }, { onDelete: 'cascade' }),
    marketDataId: (0, pg_core_1.integer)("market_data_id").notNull().references(function () { return exports.marketData.id; }, { onDelete: 'cascade' }),
    influence: (0, pg_core_1.real)("influence").notNull(), // How much this market data influenced the strategy (0-100%)
    createdAt: (0, pg_core_1.timestamp)("created_at").notNull().defaultNow(),
});
exports.strategyMarketDataRelations = (0, drizzle_orm_1.relations)(exports.strategyMarketData, function (_a) {
    var one = _a.one;
    return ({
        strategy: one(exports.strategies, {
            fields: [exports.strategyMarketData.strategyId],
            references: [exports.strategies.id],
        }),
        marketData: one(exports.marketData, {
            fields: [exports.strategyMarketData.marketDataId],
            references: [exports.marketData.id],
        }),
    });
});
exports.insertStrategyMarketDataSchema = (0, drizzle_zod_1.createInsertSchema)(exports.strategyMarketData).pick({
    strategyId: true,
    marketDataId: true,
    influence: true,
});
// News schema
exports.news = (0, pg_core_1.pgTable)("news", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    title: (0, pg_core_1.text)("title").notNull(),
    summary: (0, pg_core_1.text)("summary").notNull(),
    source: (0, pg_core_1.text)("source").notNull(),
    url: (0, pg_core_1.text)("url"),
    publishedAt: (0, pg_core_1.timestamp)("published_at").notNull(),
    sentiment: (0, pg_core_1.text)("sentiment").notNull(), // Positive, Negative, Neutral
    sentimentScore: (0, pg_core_1.real)("sentiment_score"),
    impact: (0, pg_core_1.text)("impact").notNull(), // High, Medium, Low
    sectors: (0, pg_core_1.jsonb)("sectors"),
});
exports.newsRelations = (0, drizzle_orm_1.relations)(exports.news, function (_a) {
    var many = _a.many;
    return ({
        strategyNews: many(exports.strategyNews),
    });
});
exports.insertNewsSchema = (0, drizzle_zod_1.createInsertSchema)(exports.news).pick({
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
exports.strategyNews = (0, pg_core_1.pgTable)("strategy_news", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    strategyId: (0, pg_core_1.integer)("strategy_id").notNull().references(function () { return exports.strategies.id; }, { onDelete: 'cascade' }),
    newsId: (0, pg_core_1.integer)("news_id").notNull().references(function () { return exports.news.id; }, { onDelete: 'cascade' }),
    influence: (0, pg_core_1.real)("influence").notNull(), // How much this news influenced the strategy (0-100%)
    createdAt: (0, pg_core_1.timestamp)("created_at").notNull().defaultNow(),
});
exports.strategyNewsRelations = (0, drizzle_orm_1.relations)(exports.strategyNews, function (_a) {
    var one = _a.one;
    return ({
        strategy: one(exports.strategies, {
            fields: [exports.strategyNews.strategyId],
            references: [exports.strategies.id],
        }),
        news: one(exports.news, {
            fields: [exports.strategyNews.newsId],
            references: [exports.news.id],
        }),
    });
});
exports.insertStrategyNewsSchema = (0, drizzle_zod_1.createInsertSchema)(exports.strategyNews).pick({
    strategyId: true,
    newsId: true,
    influence: true,
});
// Sector sentiment schema
exports.sectorSentiment = (0, pg_core_1.pgTable)("sector_sentiment", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    name: (0, pg_core_1.text)("name").notNull(),
    sentiment: (0, pg_core_1.text)("sentiment").notNull(),
    score: (0, pg_core_1.real)("score").notNull(),
    newsCount: (0, pg_core_1.integer)("news_count").default(0),
    keyTopics: (0, pg_core_1.jsonb)("key_topics").default([]),
    confidenceScore: (0, pg_core_1.real)("confidence_score").default(0.7),
    lastUpdated: (0, pg_core_1.timestamp)("last_updated").notNull().defaultNow(),
});
exports.insertSectorSentimentSchema = (0, drizzle_zod_1.createInsertSchema)(exports.sectorSentiment).pick({
    name: true,
    sentiment: true,
    score: true,
    newsCount: true,
    keyTopics: true,
    confidenceScore: true,
});
// MCP Status schema
exports.mcpStatus = (0, pg_core_1.pgTable)("mcp_status", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    name: (0, pg_core_1.text)("name").notNull(),
    status: (0, pg_core_1.text)("status").notNull(),
    message: (0, pg_core_1.text)("message"),
    details: (0, pg_core_1.jsonb)("details"),
    lastUpdated: (0, pg_core_1.timestamp)("last_updated").notNull().defaultNow(),
});
exports.insertMcpStatusSchema = (0, drizzle_zod_1.createInsertSchema)(exports.mcpStatus).pick({
    name: true,
    status: true,
    message: true,
    details: true,
});
