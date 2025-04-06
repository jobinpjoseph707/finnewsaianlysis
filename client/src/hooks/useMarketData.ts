import { useQuery } from "@tanstack/react-query";
import { MarketData } from "@/lib/types";
import { MCPClient } from "@/lib/mcp-client";
import { generateChartData } from "@/lib/chart-utils";

export function useMarketData() {
  return useQuery<MarketData[], Error>({
    queryKey: ['/api/mcp/market-data'],
    queryFn: async () => {
      try {
        const data = await MCPClient.getMarketData();
        
        // Add chart data to each market data item
        return data.map(market => ({
          ...market,
          data: market.data || generateChartData(
            market.value,
            market.value * 0.005, // 0.5% volatility
            50,
            market.changePercent >= 0 ? 'up' : 'down'
          )
        }));
      } catch (error) {
        console.error("Error fetching market data:", error);
        
        // Fallback mock data for development
        return [
          {
            id: 1,
            symbol: "NIFTY",
            name: "NIFTY 50",
            value: 19425.35,
            change: 92.7,
            changePercent: 0.48,
            data: generateChartData(19425.35, 10, 50, 'up')
          },
          {
            id: 2,
            symbol: "SENSEX",
            name: "SENSEX",
            value: 64882.3,
            change: 335.62,
            changePercent: 0.52,
            data: generateChartData(64882.3, 30, 50, 'up')
          },
          {
            id: 3,
            symbol: "BANKNIFTY",
            name: "BANK NIFTY",
            value: 44328.8,
            change: -53.15,
            changePercent: -0.12,
            data: generateChartData(44328.8, 20, 50, 'down')
          }
        ];
      }
    },
    staleTime: 1000 * 60, // 1 minute
  });
}
