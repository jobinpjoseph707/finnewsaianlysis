import React, { useState } from "react";
import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";
import MarketOverview from "@/components/dashboard/MarketOverview";
import AIStrategies from "@/components/dashboard/AIStrategies";
import SentimentAnalysis from "@/components/dashboard/SentimentAnalysis";
import PerformanceTracking from "@/components/dashboard/PerformanceTracking";
import MCPStatus from "@/components/dashboard/MCPStatus";
import { MCPConnectionStatus } from "@/components/dashboard/MCPConnectionStatus";
import { DappierConnectionStatus } from "@/components/dashboard/DappierConnectionStatus";
import { 
  CalendarDays, 
  RefreshCw, 
  Clock, 
  TrendingUp, 
  BarChart2, 
  Award,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  const { toast } = useToast();
  const [timeRange, setTimeRange] = useState("Last 7 days");
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Format current date
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const marketStatus = "Open"; // This would come from an API in a real implementation
  
  // Dashboard stats
  const dashboardStats = [
    { 
      label: "Market Trend", 
      value: "Bullish", 
      change: "+2.3%", 
      icon: <TrendingUp className="h-5 w-5" />,
      color: "text-green-500" 
    },
    { 
      label: "Strategies", 
      value: "8 Active", 
      change: "+3 New", 
      icon: <BarChart2 className="h-5 w-5" />,
      color: "text-blue-500" 
    },
    { 
      label: "Success Rate", 
      value: "76%", 
      change: "+4.2%", 
      icon: <Award className="h-5 w-5" />,
      color: "text-amber-500" 
    },
    { 
      label: "Last Update", 
      value: "Just now", 
      change: "", 
      icon: <Clock className="h-5 w-5" />,
      color: "text-purple-500" 
    }
  ];

  const handleRefresh = () => {
    setIsRefreshing(true);
    
    // Simulate refresh
    setTimeout(() => {
      setIsRefreshing(false);
      toast({
        title: "Dashboard Refreshed",
        description: "All data has been updated to the latest values.",
      });
    }, 1000);
  };
  
  const handleTimeRangeChange = (range: string) => {
    setTimeRange(range);
    toast({
      title: "Time Range Updated",
      description: `Dashboard data now showing for ${range}.`,
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Header />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-6">
          {/* Page Header */}
          <div className="mb-6 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gradient">Financial Dashboard</h2>
                <div className="flex items-center mt-1 text-gray-500">
                  <CalendarDays className="h-4 w-4 mr-1.5" />
                  <span className="text-sm">{currentDate}</span>
                  <span className="mx-2">•</span>
                  <Badge variant="outline" className="text-xs bg-green-50 text-green-600 border-green-200 font-medium">
                    Market {marketStatus}
                  </Badge>
                </div>
              </div>
              
              <div className="flex mt-4 md:mt-0 space-x-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center space-x-1">
                      <CalendarDays className="h-4 w-4 mr-1" />
                      <span>{timeRange}</span>
                      <ChevronDown className="h-3 w-3 ml-1 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleTimeRangeChange("Today")}>
                      Today
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleTimeRangeChange("Last 7 days")}>
                      Last 7 days
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleTimeRangeChange("Last 30 days")}>
                      Last 30 days
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleTimeRangeChange("Last quarter")}>
                      Last quarter
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleTimeRangeChange("Year to date")}>
                      Year to date
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <Button 
                  className="flex items-center space-x-1 bg-primary hover:bg-primary/90" 
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                >
                  <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                  <span className="hidden md:inline">Refresh</span>
                </Button>
              </div>
            </div>
            
            {/* Dashboard Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {dashboardStats.map((stat, index) => (
                <div key={index} className="bg-neutral-50 rounded-lg p-3 border border-gray-100">
                  <div className="flex items-center mb-2">
                    <div className={`p-2 rounded-md bg-opacity-10 ${stat.color.replace('text-', 'bg-')}`}>
                      {stat.icon}
                    </div>
                    <span className="text-sm text-gray-500 ml-2">{stat.label}</span>
                  </div>
                  <div className="flex items-baseline">
                    <div className="text-xl font-bold">{stat.value}</div>
                    {stat.change && (
                      <div className={`ml-2 text-sm ${
                        stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {stat.change}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* MCP Connection Status */}
          <div className="mb-6">
            <MCPConnectionStatus />
          </div>
          
          {/* Market Overview */}
          <div className="mb-6">
            <MarketOverview />
          </div>
          
          {/* AI Strategy Recommendations */}
          <div className="mb-6">
            <AIStrategies />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sentiment Analysis */}
            <div className="lg:col-span-2">
              <SentimentAnalysis />
            </div>
            
            {/* Performance Tracking and Status Components */}
            <div className="space-y-6">
              <PerformanceTracking />
              <MCPStatus />
              <DappierConnectionStatus />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
