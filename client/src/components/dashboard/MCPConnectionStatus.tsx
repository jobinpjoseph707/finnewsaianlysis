import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, CloudOff, Server, ExternalLink } from "lucide-react";
import { Link } from "wouter";
import { checkMCPConfiguration } from "@/lib/external-mcp-client";

export function MCPConnectionStatus() {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [serverUrl, setServerUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const isConfigured = await checkMCPConfiguration();
        setIsConnected(isConfigured);
        
        // Get the server URL from localStorage
        const savedUrl = localStorage.getItem("MCP_SERVER_URL");
        if (savedUrl) {
          // Show only the domain part for display
          try {
            const url = new URL(savedUrl);
            setServerUrl(url.hostname);
          } catch (error) {
            setServerUrl(savedUrl);
          }
        }
      } catch (error) {
        console.error("Error checking MCP connection:", error);
        setIsConnected(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkConnection();
  }, []);
  
  if (isLoading) {
    return (
      <Card className="shadow-sm h-32 flex items-center justify-center">
        <CardContent className="p-4">
          <div className="animate-pulse flex space-x-4 items-center">
            <div className="rounded-full bg-gray-200 h-10 w-10"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Server className="h-10 w-10 text-primary mr-4" />
            <div>
              <h3 className="text-lg font-medium">MCP Connection</h3>
              <p className="text-sm text-gray-500">
                {isConnected 
                  ? `Connected to external MCP server: ${serverUrl}`
                  : "Using local MCP simulation"
                }
              </p>
            </div>
          </div>
          
          <div className="flex items-center">
            {isConnected ? (
              <div className="flex items-center text-green-600">
                <CheckCircle className="h-5 w-5 mr-2" />
                <span className="font-medium">Connected</span>
              </div>
            ) : (
              <div className="flex items-center text-amber-600">
                <CloudOff className="h-5 w-5 mr-2" />
                <span className="font-medium">Local Mode</span>
              </div>
            )}
            
            <Link href="/settings" className="ml-4 flex items-center text-sm text-blue-600 hover:text-blue-800">
              <span className="mr-1">Configure</span>
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}