import { Strategy, News, SectorSentiment } from "../../shared/schema";
import { SentimentAnalyzer } from "./sentiment-analyzer";
import { MarketDataService } from "./market-data";
import { generateRandomId } from "../utils";

/**
 * AI Strategy Generator
 * Suggests new investment strategies based on recent news and sector sentiment.
 */
export class StrategyGenerator {
  constructor(
    private sentimentAnalyzer: SentimentAnalyzer,
    private marketDataService: MarketDataService
  ) {}

  /**
   * Generate new strategies based on latest news and sentiment
   */
  async generateStrategies(): Promise<Strategy[]> {
    const news = this.sentimentAnalyzer.getRecentNews();
    const sectorSentiments = this.sentimentAnalyzer.getSentimentData().sectorSentiments;
    const marketData = await this.marketDataService.getMarketData();

    // Example: Rule-based generation (replace with ML if needed)
    const strategies: Strategy[] = [];
    for (const sector of sectorSentiments) {
      if (sector.sentiment === "Bullish" && sector.score > 60) {
        strategies.push({
          id: generateRandomId(),
          title: `Bullish ${sector.name} Strategy`,
          description: `Capitalize on bullish sentiment in ${sector.name} sector, as indicated by news and market data.`,
          confidenceLevel: "High",
          riskLevel: "Medium",
          timeHorizon: "3-6 months",
          expectedReturn: "8-15%",
          sectors: [sector.name],
          generatedAt: new Date(),
          status: "suggested",
          context: { rationale: `Recent news and sentiment analysis show strong bullish signals in ${sector.name}.` }
        });
      }
    }
    // TODO: Add more sophisticated logic as needed
    return strategies;
  }
}
