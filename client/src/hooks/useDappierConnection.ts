import { useState, useEffect } from "react";
import { DappierMCPClient, checkDappierConfiguration } from "@/lib/dappier-mcp-client";

/**
 * Custom hook to check connection status to Dappier API
 * Returns the connection status and a function to manually check connection
 */
export function useDappierConnection() {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const checkConnection = async () => {
    setIsLoading(true);
    try {
      const isConfigured = await checkDappierConfiguration();
      setIsConnected(isConfigured);
    } catch (error) {
      console.error("Error checking Dappier status:", error);
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  return {
    isConnected,
    isLoading,
    checkConnection
  };
}