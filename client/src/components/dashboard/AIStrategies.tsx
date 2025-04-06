import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Bookmark, 
  Share2, 
  AlertTriangle, 
  TrendingUp, 
  Clock, 
  ShieldCheck, 
  Brain, 
  Target, 
  ArrowRight,
  Zap,
  CheckCircle,
  XCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useStrategies } from "@/hooks/useStrategies";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";

export default function AIStrategies() {
  const { data: strategies, isLoading, error } = useStrategies();
  
  if (isLoading) {
    return (
      <Card className="shadow-sm border-gray-100 mb-6">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-bold flex items-center">
              <Brain className="mr-2 h-5 w-5 text-primary" />
              AI Strategy Recommendations
            </CardTitle>
            <Button variant="outline" size="sm" className="text-primary">
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <Skeleton className="h-5 w-36 mb-2" />
                    <Skeleton className="h-6 w-28 rounded-full" />
                  </div>
                  <Skeleton className="h-24 w-full mb-4" />
                  <div className="space-y-3 mb-4">
                    <div className="flex gap-2">
                      <Skeleton className="h-5 w-5 rounded-full" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <div className="flex gap-2">
                      <Skeleton className="h-5 w-5 rounded-full" />
                      <Skeleton className="h-4 w-40" />
                    </div>
                    <div className="flex gap-2">
                      <Skeleton className="h-5 w-5 rounded-full" />
                      <Skeleton className="h-4 w-36" />
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                    <Skeleton className="h-3 w-24" />
                    <div className="flex space-x-2">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <Skeleton className="h-8 w-8 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card className="shadow-sm border-gray-100 mb-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-center p-4 text-red-500 gap-2">
            <AlertTriangle className="h-5 w-5" />
            <span className="font-medium">Error loading strategies:</span>
            <span>{error instanceof Error ? error.message : "Unknown error"}</span>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!strategies || strategies.length === 0) {
    return (
      <Card className="shadow-sm border-gray-100 mb-6">
        <CardContent className="p-8">
          <div className="text-center text-gray-500">No strategies available</div>
        </CardContent>
      </Card>
    );
  }
  
  // Function to get confidence level colors and styles
  const getConfidenceStyles = (confidenceLevel: string) => {
    switch (confidenceLevel.toLowerCase()) {
      case 'high confidence':
        return {
          topBorder: 'border-t-4 border-t-green-500',
          badge: 'bg-green-50 text-green-600 border-green-200',
          progressClass: 'bg-green-500',
          progressValue: 90,
          icon: <Zap className="h-4 w-4 text-green-500" />
        };
      case 'medium confidence':
        return {
          topBorder: 'border-t-4 border-t-blue-500',
          badge: 'bg-blue-50 text-blue-600 border-blue-200',
          progressClass: 'bg-blue-500',
          progressValue: 65,
          icon: <Target className="h-4 w-4 text-blue-500" />
        };
      case 'speculative':
        return {
          topBorder: 'border-t-4 border-t-amber-500',
          badge: 'bg-amber-50 text-amber-600 border-amber-200',
          progressClass: 'bg-amber-500',
          progressValue: 40,
          icon: <AlertTriangle className="h-4 w-4 text-amber-500" />
        };
      default:
        return {
          topBorder: 'border-t-4 border-t-gray-300',
          badge: 'bg-gray-50 text-gray-600 border-gray-200',
          progressClass: 'bg-gray-500',
          progressValue: 50,
          icon: <Target className="h-4 w-4 text-gray-500" />
        };
    }
  };
  
  // Function to get risk level indicator
  const getRiskIndicator = (riskLevel: string) => {
    switch (riskLevel.toLowerCase()) {
      case 'low':
        return {
          color: 'text-green-500',
          bgColor: 'bg-green-50',
          icon: <ShieldCheck className="h-4 w-4" />
        };
      case 'moderate':
        return {
          color: 'text-blue-500',
          bgColor: 'bg-blue-50',
          icon: <Target className="h-4 w-4" />
        };
      case 'high':
        return {
          color: 'text-orange-500',
          bgColor: 'bg-orange-50',
          icon: <AlertTriangle className="h-4 w-4" />
        };
      default:
        return {
          color: 'text-gray-500',
          bgColor: 'bg-gray-50',
          icon: <Target className="h-4 w-4" />
        };
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

  // Function to get status indicator
  const getStatusIndicator = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'inactive':
        return <XCircle className="h-4 w-4 text-gray-400" />;
      default:
        return <Clock className="h-4 w-4 text-blue-500" />;
    }
  };
  
  return (
    <Card className="shadow-sm border-gray-100 mb-6">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold flex items-center">
            <Brain className="mr-2 h-5 w-5 text-primary" />
            AI Strategy Recommendations
          </CardTitle>
          <Button variant="outline" size="sm" className="text-primary flex items-center">
            View All <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-2">
          {strategies.map((strategy) => {
            const confidenceStyles = getConfidenceStyles(strategy.confidenceLevel);
            const riskIndicator = getRiskIndicator(strategy.riskLevel);
            
            return (
              <div 
                key={strategy.id} 
                className={`bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow border border-gray-100 ${confidenceStyles.topBorder}`}
              >
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-bold">{strategy.title}</h3>
                      <div className="flex items-center mt-1">
                        {getStatusIndicator(strategy.status)}
                        <span className="text-xs text-gray-500 ml-1">
                          {strategy.status}
                        </span>
                        {strategy.performance !== undefined && (
                          <>
                            <span className="mx-2 text-gray-300">|</span>
                            <span className={`text-xs font-medium ${
                              strategy.performance > 0 ? 'text-green-500' : 'text-red-500'
                            }`}>
                              {strategy.performance > 0 ? '+' : ''}{strategy.performance}%
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <Badge variant="outline" className={`${confidenceStyles.badge} flex items-center`}>
                      {confidenceStyles.icon}
                      <span className="ml-1">{strategy.confidenceLevel}</span>
                    </Badge>
                  </div>
                  
                  <p className="text-gray-600 mb-4 text-sm line-clamp-3">{strategy.description}</p>
                  
                  <div className="mb-4 space-y-3">
                    <div className="flex items-center">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className={`p-1 rounded-md ${riskIndicator.bgColor} ${riskIndicator.color} mr-2`}>
                              {riskIndicator.icon}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Risk Level</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <div className="flex-1">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-500">Risk Level</span>
                          <span className="font-medium">{strategy.riskLevel}</span>
                        </div>
                        <Progress className="h-1.5" value={
                          strategy.riskLevel.toLowerCase() === 'low' ? 30 :
                          strategy.riskLevel.toLowerCase() === 'moderate' ? 60 : 90
                        } />
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="p-1 rounded-md bg-purple-50 text-purple-500 mr-2">
                              <Clock className="h-4 w-4" />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Time Horizon</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <span className="text-sm text-gray-600">{strategy.timeHorizon}</span>
                    </div>
                    
                    <div className="flex items-center">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="p-1 rounded-md bg-blue-50 text-blue-500 mr-2">
                              <TrendingUp className="h-4 w-4" />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Expected Return</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <span className="text-sm text-gray-600 font-medium">{strategy.expectedReturn}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                    <span className="text-xs text-gray-500">
                      Generated {formatRelativeTime(strategy.generatedAt)}
                    </span>
                    <div className="flex space-x-1">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-primary">
                              <Bookmark className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Save Strategy</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-primary">
                              <Share2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Share Strategy</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
