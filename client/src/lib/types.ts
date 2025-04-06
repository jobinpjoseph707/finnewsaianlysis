// Market Data Types
export interface MarketDataPoint {
  time: number; // timestamp
  value: number;
}

export interface MarketData {
  id: number;
  symbol: string;
  name: string;
  value: number;
  change: number;
  changePercent: number;
  data?: MarketDataPoint[];
}

// Strategy Types
export interface Strategy {
  id: number;
  title: string;
  description: string;
  confidenceLevel: string;
  riskLevel: string;
  timeHorizon: string;
  expectedReturn: string;
  sectors: string[];
  generatedAt: string;
  performance?: number;
  status: string;
}

// Sentiment Analysis Types
export interface SectorSentiment {
  name: string;
  sentiment: string;
  score: number;
}

export interface NewsItem {
  title: string;
  summary: string;
  source: string;
  time: string;
  sentiment: string;
}

export interface SentimentData {
  overallSentiment: string;
  newsSentiment: string;
  socialSentiment: string;
  sectorSentiments: SectorSentiment[];
  newsAnalysis: NewsItem[];
}

// Performance Types
export interface TopPerformingStrategy {
  name: string;
  date: string;
  return: string;
}

export interface PerformanceData {
  successRate: string;
  avgReturn: string;
  activeStrategies: number;
  topPerforming: TopPerformingStrategy[];
}

// MCP Context Types
export interface MCPContextModule {
  name: string;
  status: 'ACTIVE' | 'TRAINING' | 'ERROR' | 'PAUSED';
  message: string;
  details?: any;
}
