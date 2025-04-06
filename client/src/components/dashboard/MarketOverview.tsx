import React from "react";
import { useMarketData } from "@/hooks/useMarketData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  TrendingUp,
  Activity,
  Sparkles 
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  Tooltip,
  Area,
  AreaChart 
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { formatNumber } from "@/lib/chart-utils";

export default function MarketOverview() {
  const { data: marketData, isLoading, error } = useMarketData();
  
  if (isLoading) {
    return (
      <Card className="shadow-sm border-gray-100">
        <CardHeader className="pb-0">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold flex items-center">
              <Activity className="mr-2 h-5 w-5 text-primary" />
              Indian Market Overview
            </CardTitle>
            <Skeleton className="h-6 w-24" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <Skeleton className="h-5 w-24 mb-2" />
                    <Skeleton className="h-8 w-36" />
                  </div>
                  <div className="text-right">
                    <Skeleton className="h-6 w-16 mb-1" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
                <Skeleton className="h-[200px] w-full rounded-lg" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card className="shadow-sm border-gray-100">
        <CardContent className="pt-6">
          <div className="text-red-500 flex items-center justify-center p-4">
            <span className="font-medium">Error loading market data:</span> 
            <span className="ml-2">{error instanceof Error ? error.message : "Unknown error"}</span>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!marketData || marketData.length === 0) {
    return (
      <Card className="shadow-sm border-gray-100">
        <CardContent className="pt-6">
          <div className="text-center text-gray-500 p-8">No market data available</div>
        </CardContent>
      </Card>
    );
  }
  
  // Calculate overall market trend based on avg percentage change
  const avgChangePercent = marketData.reduce((sum, market) => sum + market.changePercent, 0) / marketData.length;
  const marketTrend = avgChangePercent > 0.5 
    ? "Bullish" 
    : avgChangePercent < -0.5 
      ? "Bearish" 
      : "Neutral";

  const getTrendColor = (changePercent: number) => {
    if (changePercent >= 1) return "text-green-600";
    if (changePercent > 0) return "text-green-500";
    if (changePercent === 0) return "text-gray-500";
    if (changePercent > -1) return "text-red-500";
    return "text-red-600";
  };
  
  const getChartGradient = (changePercent: number) => {
    return changePercent >= 0 
      ? ["rgba(76, 175, 80, 0.3)", "rgba(76, 175, 80, 0.01)"]
      : ["rgba(244, 67, 54, 0.3)", "rgba(244, 67, 54, 0.01)"];
  };
  
  return (
    <Card className="shadow-sm border-gray-100">
      <CardHeader className="pb-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold flex items-center">
            <Activity className="mr-2 h-5 w-5 text-primary" />
            Indian Market Overview
          </CardTitle>
          <Badge 
            variant="outline" 
            className={`px-3 py-1 ${
              marketTrend === "Bullish" 
                ? "bg-green-50 text-green-600 border-green-200" 
                : marketTrend === "Bearish" 
                  ? "bg-red-50 text-red-600 border-red-200"
                  : "bg-gray-50 text-gray-600 border-gray-200"
            }`}
          >
            {marketTrend === "Bullish" && <TrendingUp className="mr-1 h-3 w-3" />}
            {marketTrend === "Bearish" && <ArrowDownRight className="mr-1 h-3 w-3" />}
            <span className="font-medium">{marketTrend} Market</span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
          {marketData.map((market) => (
            <div key={market.symbol} className="space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center">
                    <h3 className="text-lg font-bold">{market.name}</h3>
                    {market.changePercent > 1.5 && (
                      <span className="ml-2">
                        <Sparkles className="h-4 w-4 text-amber-500" />
                      </span>
                    )}
                  </div>
                  <p className="text-2xl font-bold">
                    {market.value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="text-right">
                  <div className={`flex items-center justify-end ${getTrendColor(market.changePercent)}`}>
                    {market.changePercent >= 0 ? (
                      <ArrowUpRight className="h-4 w-4 mr-1" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 mr-1" />
                    )}
                    <span className="font-bold">{(Math.abs(market.changePercent)).toFixed(2)}%</span>
                  </div>
                  <p className="text-gray-500 text-sm mt-1">
                    {market.change >= 0 ? '+' : ''}{market.change.toFixed(2)} pts
                  </p>
                </div>
              </div>
              
              {market.data && (
                <div className="bg-neutral-50 rounded-lg p-2 border border-gray-100">
                  <ResponsiveContainer width="100%" height={160}>
                    <AreaChart
                      data={market.data}
                      margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                    >
                      <defs>
                        <linearGradient id={`gradient-${market.symbol}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={market.changePercent >= 0 ? "#4caf50" : "#f44336"} stopOpacity={0.3}/>
                          <stop offset="95%" stopColor={market.changePercent >= 0 ? "#4caf50" : "#f44336"} stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis 
                        dataKey="time"
                        tick={{ fontSize: 10 }}
                        tickFormatter={(tick) => {
                          const date = new Date(tick);
                          return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
                        }}
                        hide
                      />
                      <YAxis 
                        hide 
                        domain={['auto', 'auto']} 
                        tickFormatter={(value) => formatNumber(value)}
                      />
                      <Tooltip 
                        formatter={(value: number) => [
                          value.toLocaleString('en-IN', { 
                            minimumFractionDigits: 2, 
                            maximumFractionDigits: 2 
                          }), 
                          'Value'
                        ]}
                        labelFormatter={(label) => {
                          const date = new Date(label);
                          return date.toLocaleTimeString();
                        }}
                        contentStyle={{
                          borderRadius: '8px',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                          borderColor: market.changePercent >= 0 ? "#4caf50" : "#f44336"
                        }}
                      />
                      <Area 
                        type="monotone"
                        dataKey="value"
                        stroke={market.changePercent >= 0 ? "#4caf50" : "#f44336"}
                        strokeWidth={2}
                        fill={`url(#gradient-${market.symbol})`}
                        activeDot={{ r: 6, strokeWidth: 0 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                  
                  <div className="grid grid-cols-3 text-xs text-gray-500 mt-2 px-2">
                    <div>Open: <span className="font-medium">{formatNumber(market.value - market.change)}</span></div>
                    <div className="text-center">Range: <span className="font-medium">± {(market.value * 0.015).toFixed(2)}</span></div>
                    <div className="text-right">Vol: <span className="font-medium">{formatNumber(market.value * 150)}</span></div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
