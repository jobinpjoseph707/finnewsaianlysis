// Copied from server/mcp/sentiment-analyzer.ts for Vercel API use
export class SentimentAnalyzer {
  getSentimentData() {
    return {
      sentiment: "Positive",
      score: 0.73,
      updatedAt: new Date(),
      details: [
        { sector: "IT", sentiment: "Positive", score: 0.8 },
        { sector: "Pharma", sentiment: "Neutral", score: 0.5 },
        { sector: "Banking", sentiment: "Negative", score: 0.3 }
      ]
    };
  }
}
