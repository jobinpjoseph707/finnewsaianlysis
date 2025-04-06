/**
 * MCP Sentiment Analyzer
 * Analyzes market sentiment from news, social media, and other sources
 */

import { SectorSentiment, InsertSectorSentiment, News, InsertNews } from "@shared/schema";
import { generateRandomId } from "../utils";

export class SentimentAnalyzer {
  private sectorSentiments: SectorSentiment[] = [];
  private news: News[] = [];
  private sources: string[] = [];
  
  constructor() {
    // Initialize with sample data
    this.initializeSentimentData();
  }
  
  /**
   * Initialize with sample data for development
   */
  private initializeSentimentData() {
    this.sources = [
      "Economic Times", "Business Standard", "Mint", "Financial Express",
      "The Hindu BusinessLine", "LiveMint", "MoneyControl", "CNBC TV18",
      "Bloomberg Quint", "Reuters", "Equity Bulls", "Business Today", 
      "ET Markets", "Market Mojo", "Trendlyne", "Tickertape", "Twitter"
    ];
    
    const now = new Date();
    
    // Sample sector sentiments
    this.sectorSentiments = [
      {
        id: 1,
        name: "IT / Technology",
        sentiment: "Bullish",
        score: 75,
        lastUpdated: now
      },
      {
        id: 2,
        name: "Banking & Finance",
        sentiment: "Neutral",
        score: 50,
        lastUpdated: now
      },
      {
        id: 3,
        name: "Pharma",
        sentiment: "Bearish",
        score: 25,
        lastUpdated: now
      },
      {
        id: 4,
        name: "Consumer Goods",
        sentiment: "Moderately Bullish",
        score: 65,
        lastUpdated: now
      }
    ];
    
    // Sample news
    this.news = [
      {
        id: 1,
        title: "RBI to maintain accommodative stance in upcoming policy meet",
        summary: "Market experts expect RBI to maintain status quo on rates with continued focus on growth.",
        source: "Economic Times",
        url: "https://economictimes.indiatimes.com/markets/rbi-policy",
        publishedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
        sentiment: "Positive",
        sentimentScore: 0.72,
        impact: "Medium",
        sectors: ["Banking", "Finance"]
      },
      {
        id: 2,
        title: "Crude oil prices surge amid Middle East tensions",
        summary: "Brent crude jumped 2.5% overnight, may impact OMCs and increase inflation concerns.",
        source: "Business Standard",
        url: "https://business-standard.com/markets/crude-oil-surge",
        publishedAt: new Date(now.getTime() - 5 * 60 * 60 * 1000), // 5 hours ago
        sentiment: "Negative",
        sentimentScore: -0.58,
        impact: "High",
        sectors: ["Energy", "Oil & Gas"]
      }
    ];
  }
  
  /**
   * Get overall market sentiment data
   */
  getSentimentData() {
    return {
      overallSentiment: "Moderately Bullish",
      newsSentiment: "Neutral",
      socialSentiment: "Strongly Positive",
      sectorSentiments: this.sectorSentiments,
      newsAnalysis: this.news.map(news => ({
        title: news.title,
        summary: news.summary,
        source: news.source,
        time: this.getRelativeTime(news.publishedAt),
        sentiment: news.sentiment === "Positive" ? "Positive Impact" : "Negative Impact"
      }))
    };
  }
  
  /**
   * Get sentiment by sector
   */
  getSentimentBySector(sector: string): SectorSentiment | undefined {
    return this.sectorSentiments.find(s => 
      s.name.toLowerCase() === sector.toLowerCase()
    );
  }
  
  /**
   * Add a new sector sentiment
   */
  addSectorSentiment(sentiment: InsertSectorSentiment): SectorSentiment {
    const newSentiment: SectorSentiment = {
      id: generateRandomId(),
      ...sentiment,
      lastUpdated: new Date()
    };
    
    this.sectorSentiments.push(newSentiment);
    return newSentiment;
  }
  
  /**
   * Add a news item
   */
  addNews(news: InsertNews): News {
    const newNews: News = {
      id: generateRandomId(),
      ...news
    };
    
    this.news.push(newNews);
    return newNews;
  }
  
  /**
   * Get the count of monitored sources
   */
  getSourceCount(): number {
    return this.sources.length;
  }
  
  /**
   * Format relative time
   */
  private getRelativeTime(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return "just now";
    if (diffMins === 1) return "1 minute ago";
    if (diffMins < 60) return `${diffMins} minutes ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours === 1) return "1 hour ago";
    if (diffHours < 24) return `${diffHours} hours ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return "yesterday";
    if (diffDays < 30) return `${diffDays} days ago`;
    
    return date.toLocaleDateString();
  }
}
