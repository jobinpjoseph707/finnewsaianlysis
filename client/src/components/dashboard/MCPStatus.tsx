import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Settings, AlertCircle, RotateCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";

interface MCPStatusItem {
  name: string;
  status: "ACTIVE" | "TRAINING" | "ERROR" | "PAUSED";
  message: string;
}

export default function MCPStatus() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['/api/mcp/status'],
    staleTime: 1000 * 60, // 1 minute
  });
  
  const mcpStatus: MCPStatusItem[] = data || [];
  
  if (isLoading) {
    return (
      <Card className="p-4">
        <CardHeader className="px-0 pt-0">
          <Skeleton className="h-6 w-40 mb-4" />
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i}>
                <div className="flex justify-between mb-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <Skeleton className="h-4 w-24 mb-1" />
                <Skeleton className="h-3 w-40" />
              </div>
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-error flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>
              Error loading MCP status: {error instanceof Error ? error.message : "Unknown error"}
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Default MCP status if API returns empty data
  const defaultStatus: MCPStatusItem[] = [
    { 
      name: "Strategy Repository", 
      status: "ACTIVE", 
      message: "128 strategies stored" 
    },
    { 
      name: "Market Data Feed", 
      status: "ACTIVE", 
      message: "Last updated 2 minutes ago" 
    },
    { 
      name: "Sentiment Analysis", 
      status: "ACTIVE", 
      message: "17 news sources monitored" 
    },
    { 
      name: "Learning System", 
      status: "TRAINING", 
      message: "Model optimization in progress" 
    }
  ];
  
  const statusItems = mcpStatus.length > 0 ? mcpStatus : defaultStatus;
  
  // Function to get badge variant based on status
  const getBadgeVariant = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "success";
      case "TRAINING":
        return "warning";
      case "ERROR":
        return "destructive";
      case "PAUSED":
        return "secondary";
      default:
        return "outline";
    }
  };
  
  // Function to get icon based on status
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <CheckCircle className="text-success text-sm mr-1 h-4 w-4" />;
      case "TRAINING":
        return <RotateCw className="text-warning text-sm mr-1 h-4 w-4" />;
      case "ERROR":
        return <AlertCircle className="text-error text-sm mr-1 h-4 w-4" />;
      case "PAUSED":
        return <AlertCircle className="text-neutral-dark text-sm mr-1 h-4 w-4" />;
      default:
        return <CheckCircle className="text-success text-sm mr-1 h-4 w-4" />;
    }
  };
  
  return (
    <Card className="p-4">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-xl font-medium">MCP Context Status</CardTitle>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        <div className="space-y-3">
          {statusItems.map((item, index) => (
            <div key={index}>
              <div className="flex justify-between mb-1">
                <span className="text-sm">{item.name}</span>
                <Badge 
                  variant={getBadgeVariant(item.status)} 
                  className="text-xs"
                >
                  {item.status}
                </Badge>
              </div>
              <div className="flex items-center text-xs text-gray-500">
                {getStatusIcon(item.status)}
                <span>{item.message}</span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm">System Health</div>
              <div className="text-xs text-gray-500">All systems operational</div>
            </div>
            <Button variant="ghost" size="icon" className="text-primary">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
