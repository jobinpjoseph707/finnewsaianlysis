import { useQuery } from "@tanstack/react-query";
import { Strategy } from "@/lib/types";
import { MCPClient } from "@/lib/mcp-client";

export function useStrategies() {
  return useQuery<Strategy[], Error>({
    queryKey: ['/api/mcp/strategies'],
    queryFn: async () => {
      try {
        return await MCPClient.getStrategies();
      } catch (error) {
        console.error("Error fetching strategies:", error);
        
        // Fallback mock data for development
        return [
          {
            id: 1,
            title: "IT Sector Rotation",
            description: "Overweight IT sector stocks as US recession fears ease and rupee stabilizes against the dollar. Focus on companies with strong US client exposure.",
            confidenceLevel: "High Confidence",
            riskLevel: "Medium",
            timeHorizon: "3-6 months",
            expectedReturn: "12-15%",
            sectors: ["IT", "Technology"],
            generatedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(), // 10 minutes ago
            status: "active"
          },
          {
            id: 2,
            title: "Defensive Portfolio Shift",
            description: "Increase allocation to consumer staples and pharma sectors as a hedge against potential market volatility around upcoming election events.",
            confidenceLevel: "Medium Confidence",
            riskLevel: "Low",
            timeHorizon: "1-3 months",
            expectedReturn: "6-8%",
            sectors: ["Consumer Staples", "Pharma"],
            generatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
            status: "active"
          },
          {
            id: 3,
            title: "PSU Banking Momentum",
            description: "Consider momentum trade on PSU banks following recent credit growth data and positive sentiment from government infrastructure spending.",
            confidenceLevel: "Speculative",
            riskLevel: "High",
            timeHorizon: "2-4 weeks",
            expectedReturn: "10-18%",
            sectors: ["Banking", "PSU", "Financial Services"],
            generatedAt: new Date().toISOString(), // Just now
            status: "active"
          }
        ];
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
