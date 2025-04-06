import React, { useState } from "react";
import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";
import MarketOverview from "@/components/dashboard/MarketOverview";
import AIStrategies from "@/components/dashboard/AIStrategies";
import SentimentAnalysis from "@/components/dashboard/SentimentAnalysis";
import PerformanceTracking from "@/components/dashboard/PerformanceTracking";
import MCPStatus from "@/components/dashboard/MCPStatus";
import { CalendarIcon, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-6">
          {/* Page Header */}
          <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h2 className="text-2xl font-medium text-neutral-dark">Financial Dashboard</h2>
              <p className="text-gray-500">
                {currentDate} • <span className="text-secondary font-medium">Market {marketStatus}</span>
              </p>
            </div>
            
            <div className="flex mt-4 md:mt-0 space-x-2">
              <Button variant="outline" className="flex items-center space-x-1">
                <CalendarIcon className="h-4 w-4" />
                <span>{timeRange}</span>
              </Button>
              
              <Button 
                className="flex items-center space-x-1" 
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCcw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span className="hidden md:inline">Refresh</span>
              </Button>
            </div>
          </div>
          
          {/* Market Overview */}
          <MarketOverview />
          
          {/* AI Strategy Recommendations */}
          <AIStrategies />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sentiment Analysis */}
            <div className="lg:col-span-2">
              <SentimentAnalysis />
            </div>
            
            {/* Performance Tracking and MCP Status */}
            <div>
              <PerformanceTracking />
              <div className="mt-6">
                <MCPStatus />
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
