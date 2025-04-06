import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ExternalMCPClient, checkMCPConfiguration } from '@/lib/external-mcp-client';
import { DappierMCPClient, checkDappierConfiguration } from '@/lib/dappier-mcp-client';
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
  const [isDappierMCP, setIsDappierMCP] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Check if external MCP client is configured on mount
  useEffect(() => {
    const checkConfiguration = async () => {
      try {
        // First check if Dappier is configured
        const isDappierConfigured = await checkDappierConfiguration();
        setIsDappierMCP(isDappierConfigured);
        
        if (isDappierConfigured) {
          // If Dappier is configured, we're using an external MCP
          setIsExternalMCP(true);
        } else {
          // If Dappier is not configured, check if the regular external MCP is configured
          const isRegularMcpConfigured = await checkMCPConfiguration();
          setIsExternalMCP(isRegularMcpConfigured);
        }
      } catch (error) {
        console.error("Error checking MCP configuration:", error);
        setIsExternalMCP(false);
        setIsDappierMCP(false);
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
        if (isDappierMCP) {
          return await DappierMCPClient.getMarketData();
        } else if (isExternalMCP) {
          return await ExternalMCPClient.getMarketData();
        } else {
          // Fall back to the local API
          return await fetch('/api/mcp/market-data').then(res => res.json());
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
        if (isDappierMCP) {
          // For now, Dappier doesn't provide strategies, so we'll use local API
          return await fetch('/api/mcp/strategies').then(res => res.json());
        } else if (isExternalMCP) {
          return await ExternalMCPClient.getStrategies();
        } else {
          // Fall back to the local API
          return await fetch('/api/mcp/strategies').then(res => res.json());
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
        if (isDappierMCP) {
          return await DappierMCPClient.getSentimentAnalysis();
        } else if (isExternalMCP) {
          return await ExternalMCPClient.getSentimentAnalysis();
        } else {
          // Fall back to the local API
          return await fetch('/api/mcp/sentiment').then(res => res.json());
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
        if (isDappierMCP) {
          return await DappierMCPClient.getSectorSentiment(sector);
        } else if (isExternalMCP) {
          return await ExternalMCPClient.getSectorSentiment(sector);
        } else {
          // Fall back to the local API
          return await fetch(`/api/mcp/sentiment/sector/${sector}`).then(res => res.json());
        }
      },
      enabled: !isLoading && !!sector,
    });
    
    return { data, ...rest };
  };
  
  // Get news with optional search query
  const useNews = (limit: number = 10, searchQuery?: string) => {
    const { data, ...rest } = useQuery<News[]>({
      queryKey: ['news', limit, searchQuery],
      queryFn: async () => {
        if (isDappierMCP) {
          // This is our primary use case - get financial news from Dappier
          return await DappierMCPClient.getLatestNews(limit, searchQuery);
        } else if (isExternalMCP) {
          return await ExternalMCPClient.getLatestNews(limit);
        } else {
          // Fall back to the local API
          const queryParams = new URLSearchParams({ limit: limit.toString() });
          if (searchQuery) {
            queryParams.append('query', searchQuery);
          }
          return await fetch(`/api/mcp/news?${queryParams}`).then(res => res.json());
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
        if (isDappierMCP) {
          return await DappierMCPClient.getMCPStatus();
        } else if (isExternalMCP) {
          return await ExternalMCPClient.getMCPStatus();
        } else {
          // Fall back to the local API
          return await fetch('/api/mcp/status').then(res => res.json());
        }
      },
      enabled: !isLoading,
    });
    
    return { data: data || [], ...rest };
  };
  
  return {
    isExternalMCP,
    isDappierMCP,
    isLoading,
    useMarketData,
    useStrategies,
    useSentiment,
    useSectorSentiment,
    useNews,
    useStatus
  };
}