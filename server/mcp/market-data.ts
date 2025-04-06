/**
 * MCP Market Data Service
 * Fetches and processes real-time market data from Indian exchanges
 */

import { MarketData, InsertMarketData } from "@shared/schema";
import { generateRandomId } from "../utils";

export class MarketDataService {
  private marketData: MarketData[] = [];
  private lastUpdateTime: number;
  
  constructor() {
    // Initialize with sample market data
    this.initializeMarketData();
    this.lastUpdateTime = Date.now();
  }
  
  /**
   * Initialize with sample market data for development
   */
  private initializeMarketData() {
    this.marketData = [
      {
        id: 1,
        symbol: "NIFTY",
        name: "NIFTY 50",
        value: 19425.35,
        change: 92.7,
        changePercent: 0.48,
        lastUpdated: new Date(),
        data: this.generateChartData(19425.35, 10, 0.48)
      },
      {
        id: 2,
        symbol: "SENSEX",
        name: "SENSEX",
        value: 64882.3,
        change: 335.62,
        changePercent: 0.52,
        lastUpdated: new Date(),
        data: this.generateChartData(64882.3, 30, 0.52)
      },
      {
        id: 3,
        symbol: "BANKNIFTY",
        name: "BANK NIFTY",
        value: 44328.8,
        change: -53.15,
        changePercent: -0.12,
        lastUpdated: new Date(),
        data: this.generateChartData(44328.8, 20, -0.12)
      }
    ];
  }
  
  /**
   * Get all market data
   */
  getMarketData(): MarketData[] {
    return this.marketData;
  }
  
  /**
   * Get market data by symbol
   */
  getMarketDataBySymbol(symbol: string): MarketData | undefined {
    return this.marketData.find(market => 
      market.symbol.toLowerCase() === symbol.toLowerCase()
    );
  }
  
  /**
   * Add market data
   */
  addMarketData(data: InsertMarketData): MarketData {
    const newData: MarketData = {
      id: generateRandomId(),
      ...data,
      lastUpdated: new Date()
    };
    
    this.marketData.push(newData);
    this.lastUpdateTime = Date.now();
    return newData;
  }
  
  /**
   * Update market data
   */
  updateMarketData(id: number, data: Partial<MarketData>): MarketData | undefined {
    const index = this.marketData.findIndex(market => market.id === id);
    if (index === -1) return undefined;
    
    const updatedData = {
      ...this.marketData[index],
      ...data,
      lastUpdated: new Date()
    };
    
    this.marketData[index] = updatedData;
    this.lastUpdateTime = Date.now();
    return updatedData;
  }
  
  /**
   * Get last update time
   */
  getLastUpdateTime(): number {
    return this.lastUpdateTime;
  }
  
  /**
   * Generate chart data for visualization
   */
  private generateChartData(baseValue: number, volatility: number, trend: number) {
    const data = [];
    let value = baseValue - (baseValue * Math.abs(trend) / 100) * 50; // Start from a value that will trend to the current value
    const now = Date.now();
    const timeStep = 5 * 60 * 1000; // 5 minutes
    
    // Direction of the trend
    const direction = trend >= 0 ? 1 : -1;
    
    for (let i = 0; i < 50; i++) {
      // Random change with trend bias
      const randomChange = (Math.random() - 0.5) * volatility;
      const trendChange = (volatility * 0.1) * direction;
      
      // Update value
      value = value + randomChange + trendChange;
      
      // Add data point
      data.push({
        time: now - (50 - i) * timeStep,
        value
      });
    }
    
    return data;
  }
}
