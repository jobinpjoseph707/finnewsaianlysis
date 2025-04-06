import { useQuery } from "@tanstack/react-query";
import { PerformanceData } from "@/lib/types";
import { MCPClient } from "@/lib/mcp-client";

export function usePerformance() {
  return useQuery<PerformanceData, Error>({
    queryKey: ['/api/mcp/performance'],
    queryFn: async () => {
      try {
        return await MCPClient.getPerformanceTracking();
      } catch (error) {
        console.error("Error fetching performance data:", error);
        
        // Fallback mock data for development
        return {
          successRate: "76%",
          avgReturn: "+12.4%",
          activeStrategies: 8,
          topPerforming: [
            {
              name: "Midcap IT Allocation",
              date: "June 12, 2023",
              return: "+24.7%"
            },
            {
              name: "PSU Bank Rotation",
              date: "May 28, 2023",
              return: "+18.2%"
            }
          ]
        };
      }
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
}
