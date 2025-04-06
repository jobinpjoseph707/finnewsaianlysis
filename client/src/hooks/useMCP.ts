import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ExternalMCPClient, checkMCPConfiguration } from '@/lib/external-mcp-client';
import type { 
  MarketData, 
  Strategy, 
  News, 
  SectorSentiment, 
  McpStatus 
} from '@shared/schema';

/**
 * Custom hook for accessing MCP data
 * This hook will automatically use the external MCP client if configured,
 * or fall back to the local API endpoints when not configured
 */
export function useMCP() {
  const [isExternalMCP, setIsExternalMCP] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Check if external MCP client is configured on mount
  useEffect(() => {
    const checkConfiguration = async () => {
      try {
        const isConfigured = await checkMCPConfiguration();
        setIsExternalMCP(isConfigured);
      } catch (error) {
        console.error("Error checking MCP configuration:", error);
        setIsExternalMCP(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkConfiguration();
  }, []);
  
  // Get market data
  const useMarketData = () => {
    const { data, ...rest } = useQuery<MarketData[]>({
      queryKey: ['market-data'],
      queryFn: async () => {
        if (isExternalMCP) {
          return await ExternalMCPClient.getMarketData();
        } else {
          // Fall back to the local API
          return await fetch('/api/market-data').then(res => res.json());
        }
      },
      enabled: !isLoading,
    });
    
    return { data: data || [], ...rest };
  };
  
  // Get strategies
  const useStrategies = () => {
    const { data, ...rest } = useQuery<Strategy[]>({
      queryKey: ['strategies'],
      queryFn: async () => {
        if (isExternalMCP) {
          return await ExternalMCPClient.getStrategies();
        } else {
          // Fall back to the local API
          return await fetch('/api/strategies').then(res => res.json());
        }
      },
      enabled: !isLoading,
    });
    
    return { data: data || [], ...rest };
  };
  
  // Get sentiment analysis
  const useSentiment = () => {
    const { data, ...rest } = useQuery<any>({
      queryKey: ['sentiment'],
      queryFn: async () => {
        if (isExternalMCP) {
          return await ExternalMCPClient.getSentimentAnalysis();
        } else {
          // Fall back to the local API
          return await fetch('/api/sentiment').then(res => res.json());
        }
      },
      enabled: !isLoading,
    });
    
    return { data: data || {}, ...rest };
  };
  
  // Get sector sentiment
  const useSectorSentiment = (sector: string) => {
    const { data, ...rest } = useQuery<SectorSentiment>({
      queryKey: ['sentiment', 'sector', sector],
      queryFn: async () => {
        if (isExternalMCP) {
          return await ExternalMCPClient.getSectorSentiment(sector);
        } else {
          // Fall back to the local API
          return await fetch(`/api/sentiment/sector/${sector}`).then(res => res.json());
        }
      },
      enabled: !isLoading && !!sector,
    });
    
    return { data, ...rest };
  };
  
  // Get news
  const useNews = (limit: number = 10) => {
    const { data, ...rest } = useQuery<News[]>({
      queryKey: ['news', limit],
      queryFn: async () => {
        if (isExternalMCP) {
          return await ExternalMCPClient.getLatestNews(limit);
        } else {
          // Fall back to the local API
          return await fetch(`/api/news?limit=${limit}`).then(res => res.json());
        }
      },
      enabled: !isLoading,
    });
    
    return { data: data || [], ...rest };
  };
  
  // Get MCP status
  const useStatus = () => {
    const { data, ...rest } = useQuery<McpStatus[]>({
      queryKey: ['mcp-status'],
      queryFn: async () => {
        if (isExternalMCP) {
          return await ExternalMCPClient.getMCPStatus();
        } else {
          // Fall back to the local API
          return await fetch('/api/mcp-status').then(res => res.json());
        }
      },
      enabled: !isLoading,
    });
    
    return { data: data || [], ...rest };
  };
  
  return {
    isExternalMCP,
    isLoading,
    useMarketData,
    useStrategies,
    useSentiment,
    useSectorSentiment,
    useNews,
    useStatus
  };
}