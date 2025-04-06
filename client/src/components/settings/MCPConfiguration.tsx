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
import { AlertTriangle, CheckCircle, Server, Shield, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { checkMCPConfiguration, ExternalMCPClient } from "@/lib/external-mcp-client";

export function MCPConfiguration() {
  const { toast } = useToast();
  const [mcpUrl, setMcpUrl] = useState<string>("");
  const [mcpApiKey, setMcpApiKey] = useState<string>("");
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isConfigured, setIsConfigured] = useState<boolean>(false);
  
  // Load saved credentials on component mount
  useEffect(() => {
    const savedUrl = localStorage.getItem("MCP_SERVER_URL");
    const savedKey = localStorage.getItem("MCP_API_KEY");
    
    if (savedUrl) setMcpUrl(savedUrl);
    if (savedKey) setMcpApiKey(savedKey);
    
    // Check if already configured
    if (savedUrl && savedKey) {
      setIsConfigured(true);
      checkConnection();
    }
  }, []);
  
  // Test connection to MCP server
  const checkConnection = async () => {
    setIsLoading(true);
    try {
      // Initialize with current values
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
    
    // Save to local storage
    localStorage.setItem("MCP_SERVER_URL", mcpUrl);
    localStorage.setItem("MCP_API_KEY", mcpApiKey);
    setIsConfigured(true);
    
    toast({
      title: "Configuration saved",
      description: "MCP server configuration has been saved",
      variant: "default"
    });
    
    // Test connection with new config
    checkConnection();
  };
  
  // Clear configuration
  const clearConfiguration = () => {
    localStorage.removeItem("MCP_SERVER_URL");
    localStorage.removeItem("MCP_API_KEY");
    setMcpUrl("");
    setMcpApiKey("");
    setIsConnected(false);
    setIsConfigured(false);
    
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
              <Server className="mr-2 h-5 w-5 text-primary" />
              MCP Server Configuration
            </CardTitle>
            <CardDescription>
              Connect to an external Model Context Protocol server
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
          <Label htmlFor="mcp-url">MCP Server URL</Label>
          <Input 
            id="mcp-url" 
            placeholder="https://your-mcp-server.com/api" 
            value={mcpUrl}
            onChange={(e) => setMcpUrl(e.target.value)}
          />
          <p className="text-xs text-gray-500">
            The base URL of your Model Context Protocol server
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
            The authentication key for accessing the MCP server
          </p>
        </div>
        
        {isConfigured && (
          <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
            <div className="flex items-start gap-2">
              <Shield className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <h3 className="font-medium text-blue-800">Configuration Status</h3>
                <p className="text-sm text-blue-600">
                  {isConnected 
                    ? "Your application is connected to the MCP server and using real-time data." 
                    : "Configuration saved but connection failed. Check your server URL and API key."
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
                  Your application is using simulated MCP data. Configure an external MCP server to use real-time data.
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
            onClick={checkConnection} 
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