import { useState, useEffect } from 'react';
import { checkDappierConfiguration } from '@/lib/dappier-mcp-client';

/**
 * Custom hook to check connection status to Dappier API
 * Returns the connection status and a function to manually check connection
 */
export function useDappierConnection() {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const checkConnection = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const connected = await checkDappierConfiguration();
      setIsConnected(connected);
      return connected;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to connect to Dappier API";
      setError(errorMessage);
      setIsConnected(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Check connection status on mount
    checkConnection();
  }, []);

  return {
    isConnected,
    isLoading,
    error,
    checkConnection
  };
}