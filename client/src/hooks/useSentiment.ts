import { useQuery } from "@tanstack/react-query";
import { SentimentData } from "@/lib/types";
import { MCPClient } from "@/lib/mcp-client";

export function useSentiment() {
  return useQuery<SentimentData, Error>({
    queryKey: ['/api/mcp/sentiment'],
    queryFn: async () => {
      try {
        return await MCPClient.getSentimentAnalysis();
      } catch (error) {
        console.error("Error fetching sentiment data:", error);
        
        // Fallback mock data for development
        return {
          overallSentiment: "Moderately Bullish",
          newsSentiment: "Neutral",
          socialSentiment: "Strongly Positive",
          sectorSentiments: [
            {
              name: "IT / Technology",
              sentiment: "Bullish",
              score: 75
            },
            {
              name: "Banking & Finance",
              sentiment: "Neutral",
              score: 50
            },
            {
              name: "Pharma",
              sentiment: "Bearish",
              score: 25
            },
            {
              name: "Consumer Goods",
              sentiment: "Moderately Bullish",
              score: 65
            }
          ],
          newsAnalysis: [
            {
              title: "RBI to maintain accommodative stance in upcoming policy meet",
              summary: "Market experts expect RBI to maintain status quo on rates with continued focus on growth.",
              source: "Economic Times",
              time: "2 hours ago",
              sentiment: "Positive Impact"
            },
            {
              title: "Crude oil prices surge amid Middle East tensions",
              summary: "Brent crude jumped 2.5% overnight, may impact OMCs and increase inflation concerns.",
              source: "Business Standard",
              time: "5 hours ago",
              sentiment: "Negative Impact"
            }
          ]
        };
      }
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}
