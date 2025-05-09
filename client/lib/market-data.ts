// Copied from server/mcp/market-data.ts for Vercel API use
import { MarketData, InsertMarketData } from "../../shared/schema";

const MCP_URL = process.env.MCP_URL;
const MCP_API_KEY = process.env.MCP_API_KEY;

export class MarketDataService {
  private marketData: MarketData[] = [];
  private lastUpdateTime: number;
  
  constructor() {
    // If MCP is not configured, use mock data
    if (!MCP_URL || !MCP_API_KEY) {
      this.initializeMarketData();
    }
    this.lastUpdateTime = Date.now();
  }
  
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
  
  async getMarketData(): Promise<MarketData[]> {
    // If you want to fetch from a real API, implement here
    return this.marketData;
  }

  async getMarketDataBySymbol(symbol: string): Promise<MarketData | undefined> {
    return this.marketData.find(market => market.symbol.toLowerCase() === symbol.toLowerCase());
  }

  addMarketData(data: InsertMarketData): MarketData {
    const newData: MarketData = {
      id: Math.floor(Math.random() * 1e4) + 1,
      ...data,
      lastUpdated: new Date(),
      data: data.data ?? []
    };
    this.marketData.push(newData);
    this.lastUpdateTime = Date.now();
    return newData;
  }

  updateMarketData(id: number, data: Partial<MarketData>): MarketData | undefined {
    const index = this.marketData.findIndex(market => market.id === id);
    if (index === -1) return undefined;
    const updatedData = {
      ...this.marketData[index],
      ...data,
      lastUpdated: new Date(),
      data: data.data ?? this.marketData[index].data ?? []
    };
    this.marketData[index] = updatedData;
    this.lastUpdateTime = Date.now();
    return updatedData;
  }

  getLastUpdateTime(): number {
    return this.lastUpdateTime;
  }

  private generateChartData(baseValue: number, volatility: number, trend: number) {
    const data: { time: number; value: number }[] = [];
    let value = baseValue - (baseValue * Math.abs(trend) / 100) * 50;
    const now = Date.now();
    const timeStep = 5 * 60 * 1000;
    const direction = trend >= 0 ? 1 : -1;
    for (let i = 0; i < 50; i++) {
      const randomChange = (Math.random() - 0.5) * volatility;
      const trendChange = (volatility * 0.1) * direction;
      value = value + randomChange + trendChange;
      data.push({
        time: now - (50 - i) * timeStep,
        value
      });
    }
    return data;
  }
}
