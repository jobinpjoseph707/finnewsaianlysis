import React from "react";
import { useStrategies } from "@/hooks/useStrategies";
import Header from "@/components/layouts/Header";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  BarChart2, 
  TrendingUp, 
  AlertTriangle, 
  ArrowUp, 
  ArrowDown,
  Clock,
  CheckCircle,
  XCircle,
  FilterIcon,
  Plus,
  Brain,
  Zap,
  Target
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";

export default function Strategies() {
  const { data: strategies, isLoading, error } = useStrategies();
  const [filter, setFilter] = React.useState("all");
  const [sectorFilter, setSectorFilter] = React.useState("all");
  const [sortBy, setSortBy] = React.useState("recent");

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

  // Function to get risk indicator
  const getRiskIndicator = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'low':
        return (
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
            <span className="text-xs font-medium text-green-700">Low Risk</span>
          </div>
        );
      case 'medium':
        return (
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-yellow-500 mr-1"></div>
            <span className="text-xs font-medium text-yellow-700">Medium Risk</span>
          </div>
        );
      case 'high':
        return (
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
            <span className="text-xs font-medium text-red-700">High Risk</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-gray-400 mr-1"></div>
            <span className="text-xs font-medium text-gray-700">Unknown Risk</span>
          </div>
        );
    }
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

  // Extract all unique sectors for filtering
  const allSectors = strategies 
    ? [...new Set(strategies.flatMap(strategy => strategy.sectors))]
    : [];
    
  // Get relative time from date
  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    
    return Math.floor(seconds) + " seconds ago";
  };

  // Filter and sort strategies
  const filteredStrategies = React.useMemo(() => {
    if (!strategies) return [];
    
    // Apply status filter
    let result = strategies;
    if (filter !== "all") {
      result = strategies.filter(s => s.status.toLowerCase() === filter.toLowerCase());
    }
    
    // Apply sector filter
    if (sectorFilter !== "all") {
      result = result.filter(s => s.sectors.includes(sectorFilter));
    }
    
    // Apply sorting
    return [...result].sort((a, b) => {
      if (sortBy === "recent") {
        return new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime();
      } else if (sortBy === "performance") {
        const aPerf = a.performance || 0;
        const bPerf = b.performance || 0;
        return bPerf - aPerf;
      } else if (sortBy === "confidence") {
        const confidenceOrder = { "high confidence": 3, "medium confidence": 2, "speculative": 1 };
        const aConf = confidenceOrder[a.confidenceLevel.toLowerCase()] || 0;
        const bConf = confidenceOrder[b.confidenceLevel.toLowerCase()] || 0;
        return bConf - aConf;
      }
      return 0;
    });
  }, [strategies, filter, sectorFilter, sortBy]);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <main className="container mx-auto px-4 py-6 flex-1">
          <h1 className="text-3xl font-bold mb-6 flex items-center">
            <TrendingUp className="mr-2 h-8 w-8 text-primary" />
            AI Investment Strategies
          </h1>
          
          <Card className="shadow-sm border-gray-100 mb-6">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-2">
                {Array(6).fill(0).map((_, i) => (
                  <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                    <div className="border-t-4 border-t-gray-300">
                      <div className="p-5">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <Skeleton className="h-6 w-40 mb-2" />
                            <Skeleton className="h-4 w-24" />
                          </div>
                          <Skeleton className="h-6 w-24 rounded-full" />
                        </div>
                        <Skeleton className="h-4 w-full mb-1" />
                        <Skeleton className="h-4 w-full mb-1" />
                        <Skeleton className="h-4 w-3/4 mb-4" />
                        <div className="flex justify-between mb-2">
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
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <main className="container mx-auto px-4 py-6 flex-1">
          <h1 className="text-3xl font-bold mb-6 flex items-center">
            <TrendingUp className="mr-2 h-8 w-8 text-primary" />
            AI Investment Strategies
          </h1>
          
          <Card className="shadow-sm border-gray-100 mb-6">
            <CardContent className="p-6">
              <div className="flex items-center justify-center p-4 text-red-500 gap-2">
                <AlertTriangle className="h-5 w-5" />
                <span className="font-medium">Error loading strategies:</span>
                <span>{error instanceof Error ? error.message : "Unknown error"}</span>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="container mx-auto px-4 py-6 flex-1">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold flex items-center">
            <TrendingUp className="mr-2 h-8 w-8 text-primary" />
            AI Investment Strategies
          </h1>
          
          <Button className="bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary">
            <Plus className="h-4 w-4 mr-2" />
            New Strategy
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          <Card className="bg-gradient-to-br from-primary/80 to-primary/90 text-white shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-bold">Total Strategies</h2>
                <div className="bg-white/20 p-2 rounded-full">
                  <BarChart2 className="h-5 w-5" />
                </div>
              </div>
              <div className="text-3xl font-bold mb-1">{strategies?.length || 0}</div>
              <div className="text-white/70 text-sm">Across {allSectors.length} sectors</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-500/80 to-green-600/90 text-white shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-bold">Active Strategies</h2>
                <div className="bg-white/20 p-2 rounded-full">
                  <CheckCircle className="h-5 w-5" />
                </div>
              </div>
              <div className="text-3xl font-bold mb-1">
                {strategies?.filter(s => s.status.toLowerCase() === 'active').length || 0}
              </div>
              <div className="text-white/70 text-sm">Ready for implementation</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-blue-500/80 to-blue-600/90 text-white shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-bold">Avg. Confidence</h2>
                <div className="bg-white/20 p-2 rounded-full">
                  <Target className="h-5 w-5" />
                </div>
              </div>
              <div className="text-3xl font-bold mb-1">Medium</div>
              <div className="text-white/70 text-sm">Based on market conditions</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-500/80 to-purple-600/90 text-white shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-bold">Avg. Return</h2>
                <div className="bg-white/20 p-2 rounded-full">
                  <TrendingUp className="h-5 w-5" />
                </div>
              </div>
              <div className="text-3xl font-bold mb-1">+10.2%</div>
              <div className="text-white/70 text-sm">Expected annualized</div>
            </CardContent>
          </Card>
        </div>
        
        <Card className="shadow-sm border-gray-100 mb-6">
          <CardHeader className="pb-2">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <CardTitle className="text-xl font-bold flex items-center">
                <Brain className="mr-2 h-5 w-5 text-primary" />
                Strategy Recommendations
              </CardTitle>
              
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center">
                  <span className="text-sm text-gray-500 mr-2">Filter:</span>
                  <Select value={filter} onValueChange={setFilter}>
                    <SelectTrigger className="w-[120px] h-8">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center">
                  <span className="text-sm text-gray-500 mr-2">Sector:</span>
                  <Select value={sectorFilter} onValueChange={setSectorFilter}>
                    <SelectTrigger className="w-[150px] h-8">
                      <SelectValue placeholder="All Sectors" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sectors</SelectItem>
                      {allSectors.map(sector => (
                        <SelectItem key={sector} value={sector}>{sector}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center">
                  <span className="text-sm text-gray-500 mr-2">Sort:</span>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[140px] h-8">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recent">Most Recent</SelectItem>
                      <SelectItem value="performance">Performance</SelectItem>
                      <SelectItem value="confidence">Confidence</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-2">
              {filteredStrategies.length > 0 ? (
                filteredStrategies.map((strategy) => {
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
                        
                        <div className="flex justify-between mb-2">
                          <div className="flex items-center">
                            {riskIndicator}
                          </div>
                          <span className="text-xs text-gray-500">
                            {getRelativeTime(strategy.generatedAt)}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 mb-4">
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
                          <div className="flex flex-wrap gap-1">
                            {strategy.sectors.map((sector) => (
                              <Badge key={sector} variant="secondary" className="text-xs">
                                {sector}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="ghost" className="rounded-full h-8 w-8 p-0">
                              <ArrowUp className="h-4 w-4 text-gray-500" />
                            </Button>
                            <Button size="sm" variant="ghost" className="rounded-full h-8 w-8 p-0">
                              <ArrowDown className="h-4 w-4 text-gray-500" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-3 text-center p-6 bg-gray-50 rounded-lg">
                  <div className="text-gray-500">No strategies found for the selected filters.</div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}