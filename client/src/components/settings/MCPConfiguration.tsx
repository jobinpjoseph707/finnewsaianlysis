import React, { useEffect, useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription,
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, BookOpen, CheckCircle, Server, Shield, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { checkMCPConfiguration, ExternalMCPClient } from "@/lib/external-mcp-client";
import { checkDappierConfiguration, DappierMCPClient } from "@/lib/dappier-mcp-client";

export function MCPConfiguration() {
  const { toast } = useToast();
  const [mcpUrl, setMcpUrl] = useState<string>("");
  const [mcpApiKey, setMcpApiKey] = useState<string>("");
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isDappier, setIsDappier] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isConfigured, setIsConfigured] = useState<boolean>(false);
  
  // Test connection to Dappier MCP server
  const checkDappierConnection = async () => {
    setIsLoading(true);
    try {
      // Initialize with current values
      DappierMCPClient.initialize(mcpUrl, mcpApiKey);
      
      // Try to get status
      const status = await DappierMCPClient.getMCPStatus();
      setIsConnected(true);
      
      toast({
        title: "Dappier connection successful",
        description: "Successfully connected to the Dappier Financial News API",
        variant: "default"
      });
    } catch (error) {
      console.error("Failed to connect to Dappier server:", error);
      setIsConnected(false);
      
      toast({
        title: "Dappier connection failed",
        description: error instanceof Error ? error.message : "Could not connect to Dappier API",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Test connection to standard MCP server
  const checkConnection = async () => {
    setIsLoading(true);
    try {
      // Check if URL contains "dappier" and switch to Dappier client if it does
      if (mcpUrl.includes("api.dappier.com") || mcpUrl.includes("dappier")) {
        setIsDappier(true);
        return checkDappierConnection();
      }
      
      // Otherwise, use standard MCP client
      setIsDappier(false);
      ExternalMCPClient.initialize(mcpUrl, mcpApiKey);
      
      // Try to get status
      const status = await ExternalMCPClient.getMCPStatus();
      setIsConnected(true);
      
      toast({
        title: "Connection successful",
        description: "Successfully connected to the MCP server",
        variant: "default"
      });
    } catch (error) {
      console.error("Failed to connect to MCP server:", error);
      setIsConnected(false);
      
      toast({
        title: "Connection failed",
        description: error instanceof Error ? error.message : "Could not connect to MCP server",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load saved credentials on component mount
  useEffect(() => {
    const savedUrl = localStorage.getItem("MCP_SERVER_URL");
    const savedKey = localStorage.getItem("MCP_API_KEY");
    
    if (savedUrl) setMcpUrl(savedUrl);
    if (savedKey) setMcpApiKey(savedKey);
    
    // Check if already configured
    if (savedUrl && savedKey) {
      setIsConfigured(true);
      
      // Check if this is a Dappier URL
      if (savedUrl.includes("api.dappier.com") || savedUrl.includes("dappier")) {
        setIsDappier(true);
        checkDappierConnection();
      } else {
        checkConnection();
      }
    }
  }, []);
  
  // Save configuration
  const saveConfiguration = () => {
    // Validate inputs
    if (!mcpUrl || !mcpApiKey) {
      toast({
        title: "Missing fields",
        description: "Please provide both the MCP Server URL and API Key",
        variant: "destructive"
      });
      return;
    }
    
    // Check for Dappier URL
    const isDappierUrl = mcpUrl.includes("api.dappier.com") || mcpUrl.includes("dappier");
    setIsDappier(isDappierUrl);
    
    // Save to local storage
    localStorage.setItem("MCP_SERVER_URL", mcpUrl);
    localStorage.setItem("MCP_API_KEY", mcpApiKey);
    setIsConfigured(true);
    
    toast({
      title: "Configuration saved",
      description: isDappierUrl 
        ? "Dappier configuration has been saved" 
        : "MCP server configuration has been saved",
      variant: "default"
    });
    
    // Test connection with new config
    if (isDappierUrl) {
      checkDappierConnection();
    } else {
      checkConnection();
    }
  };
  
  // Clear configuration
  const clearConfiguration = () => {
    localStorage.removeItem("MCP_SERVER_URL");
    localStorage.removeItem("MCP_API_KEY");
    setMcpUrl("");
    setMcpApiKey("");
    setIsConnected(false);
    setIsConfigured(false);
    setIsDappier(false);
    
    toast({
      title: "Configuration cleared",
      description: "MCP server configuration has been removed",
      variant: "default"
    });
  };
  
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              {isDappier ? (
                <BookOpen className="mr-2 h-5 w-5 text-primary" />
              ) : (
                <Server className="mr-2 h-5 w-5 text-primary" />
              )}
              {isDappier ? "Dappier Financial News API" : "MCP Server Configuration"}
            </CardTitle>
            <CardDescription>
              {isDappier 
                ? "Connect to Dappier's specialized financial news API for Indian markets" 
                : "Connect to an external Model Context Protocol server"}
            </CardDescription>
          </div>
          
          {isConfigured && (
            <Badge 
              variant="outline" 
              className={isConnected 
                ? "bg-green-50 text-green-600 border-green-200 flex items-center" 
                : "bg-red-50 text-red-600 border-red-200 flex items-center"
              }
            >
              {isConnected 
                ? <><CheckCircle className="mr-1 h-3 w-3" /> Connected</> 
                : <><XCircle className="mr-1 h-3 w-3" /> Disconnected</>
              }
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="mcp-url">Server URL</Label>
          <Input 
            id="mcp-url" 
            placeholder={isDappier 
              ? "https://api.dappier.com/app/aimodel/..." 
              : "https://your-mcp-server.com/api"
            } 
            value={mcpUrl}
            onChange={(e) => {
              setMcpUrl(e.target.value);
              // Auto-detect Dappier URL
              setIsDappier(
                e.target.value.includes("api.dappier.com") || 
                e.target.value.includes("dappier")
              );
            }}
          />
          <p className="text-xs text-gray-500">
            {isDappier 
              ? "The Dappier API endpoint URL" 
              : "The base URL of your Model Context Protocol server"
            }
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="mcp-api-key">API Key</Label>
          <div className="flex gap-2">
            <Input 
              id="mcp-api-key" 
              type="password"
              placeholder="your-api-key" 
              value={mcpApiKey}
              onChange={(e) => setMcpApiKey(e.target.value)}
            />
          </div>
          <p className="text-xs text-gray-500">
            {isDappier 
              ? "Your Dappier authentication token"
              : "The authentication key for accessing the MCP server"
            }
          </p>
        </div>
        
        {isDappier && (
          <div className="bg-purple-50 p-4 rounded-md border border-purple-100">
            <div className="flex items-start gap-2">
              <BookOpen className="h-5 w-5 text-purple-500 mt-0.5" />
              <div>
                <h3 className="font-medium text-purple-800">Dappier Integration</h3>
                <p className="text-sm text-purple-600">
                  Dappier provides specialized financial news and sentiment analysis for Indian markets.
                </p>
              </div>
            </div>
          </div>
        )}
        
        {isConfigured && (
          <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
            <div className="flex items-start gap-2">
              <Shield className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <h3 className="font-medium text-blue-800">Configuration Status</h3>
                <p className="text-sm text-blue-600">
                  {isConnected 
                    ? `Your application is connected to the ${isDappier ? "Dappier API" : "MCP server"} and using real-time data.` 
                    : `Configuration saved but connection failed. Check your ${isDappier ? "Dappier URL" : "server URL"} and API key.`
                  }
                </p>
              </div>
            </div>
          </div>
        )}
        
        {!isConfigured && (
          <div className="bg-amber-50 p-4 rounded-md border border-amber-100">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
              <div>
                <h3 className="font-medium text-amber-800">Not Configured</h3>
                <p className="text-sm text-amber-600">
                  Your application is using simulated data. Configure an external data source to use real-time data.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="justify-between flex-wrap gap-2">
        <div>
          {isConfigured && (
            <Button 
              variant="outline" 
              onClick={clearConfiguration} 
              className="text-red-500 hover:bg-red-50 hover:text-red-500"
            >
              Clear Configuration
            </Button>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={isDappier ? checkDappierConnection : checkConnection} 
            disabled={!mcpUrl || !mcpApiKey || isLoading}
          >
            Test Connection
          </Button>
          
          <Button 
            onClick={saveConfiguration} 
            disabled={!mcpUrl || !mcpApiKey || isLoading}
            className="bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary"
          >
            Save Configuration
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}