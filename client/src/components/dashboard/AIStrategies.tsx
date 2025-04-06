import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Bookmark, Share2, AlertTriangle, TrendingUp, Clock, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useStrategies } from "@/hooks/useStrategies";

export default function AIStrategies() {
  const { data: strategies, isLoading, error } = useStrategies();
  
  if (isLoading) {
    return (
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-medium">AI Strategy Recommendations</h2>
          <Button variant="link" className="text-primary">
            View All
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="p-4 border-l-4 border-gray-300">
              <div className="flex justify-between items-start mb-2">
                <Skeleton className="h-5 w-36 mb-2" />
                <Skeleton className="h-5 w-24" />
              </div>
              <Skeleton className="h-16 w-full mb-4" />
              <div className="space-y-2 mb-4">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-36" />
              </div>
              <div className="flex justify-between items-center">
                <Skeleton className="h-3 w-24" />
                <div className="flex space-x-2">
                  <Skeleton className="h-6 w-6 rounded-full" />
                  <Skeleton className="h-6 w-6 rounded-full" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <Card className="p-4 mb-8">
        <CardContent className="pt-4 flex items-center">
          <AlertTriangle className="h-5 w-5 text-error mr-2" />
          <div className="text-error">
            Error loading strategies: {error instanceof Error ? error.message : "Unknown error"}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!strategies || strategies.length === 0) {
    return (
      <Card className="p-4 mb-8">
        <CardContent className="pt-4">
          <div className="text-center text-gray-500">No strategies available</div>
        </CardContent>
      </Card>
    );
  }
  
  // Function to get border color based on confidence level
  const getBorderColor = (confidenceLevel: string) => {
    switch (confidenceLevel.toLowerCase()) {
      case 'high confidence':
        return 'border-secondary';
      case 'medium confidence':
        return 'border-info';
      case 'speculative':
        return 'border-warning';
      default:
        return 'border-gray-300';
    }
  };
  
  // Function to get badge style based on confidence level
  const getBadgeVariant = (confidenceLevel: string) => {
    switch (confidenceLevel.toLowerCase()) {
      case 'high confidence':
        return 'secondary';
      case 'medium confidence':
        return 'default';
      case 'speculative':
        return 'warning';
      default:
        return 'outline';
    }
  };
  
  // Format the relative time
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
  };
  
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-medium">AI Strategy Recommendations</h2>
        <Button variant="link" className="text-primary">
          View All
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {strategies.map((strategy) => (
          <Card 
            key={strategy.id} 
            className={`p-4 border-l-4 ${getBorderColor(strategy.confidenceLevel)} hover:shadow-md transition-shadow`}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-medium">{strategy.title}</h3>
              <Badge variant={getBadgeVariant(strategy.confidenceLevel)}>
                {strategy.confidenceLevel}
              </Badge>
            </div>
            
            <p className="text-gray-600 mb-4 text-sm">{strategy.description}</p>
            
            <div className="mb-4">
              <div className="flex space-x-1 mb-1">
                <Activity className="text-warning text-sm h-4 w-4" />
                <span className="text-sm text-gray-600">Risk Level: <span className="font-medium">{strategy.riskLevel}</span></span>
              </div>
              <div className="flex space-x-1 mb-1">
                <Clock className="text-info text-sm h-4 w-4" />
                <span className="text-sm text-gray-600">Time Horizon: <span className="font-medium">{strategy.timeHorizon}</span></span>
              </div>
              <div className="flex space-x-1">
                <TrendingUp className="text-secondary text-sm h-4 w-4" />
                <span className="text-sm text-gray-600">Expected Return: <span className="font-medium">{strategy.expectedReturn}</span></span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">
                Generated {formatRelativeTime(strategy.generatedAt)}
              </span>
              <div className="flex space-x-2">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-primary">
                  <Bookmark className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-primary">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
