import React from "react";
import { useMarketData } from "@/hooks/useMarketData";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUp, ArrowDown } from "lucide-react";
import { 
  LineChart, 
  Line, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  Tooltip 
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

export default function MarketOverview() {
  const { data: marketData, isLoading, error } = useMarketData();
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <Skeleton className="h-5 w-24 mb-2" />
                <Skeleton className="h-8 w-36" />
              </div>
              <div className="text-right">
                <Skeleton className="h-6 w-16 mb-1" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
            <Skeleton className="h-[200px] w-full" />
          </Card>
        ))}
      </div>
    );
  }
  
  if (error) {
    return (
      <Card className="p-4 mb-6">
        <CardContent className="pt-4">
          <div className="text-error">
            Error loading market data: {error instanceof Error ? error.message : "Unknown error"}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!marketData || marketData.length === 0) {
    return (
      <Card className="p-4 mb-6">
        <CardContent className="pt-4">
          <div className="text-center text-gray-500">No market data available</div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {marketData.map((market) => (
        <Card key={market.symbol} className="p-4 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-medium">{market.name}</h3>
              <p className="text-2xl font-medium">{market.value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
            <div className="text-right">
              <span className={`inline-block px-2 py-0.5 rounded text-sm ${
                market.changePercent >= 0 
                  ? 'bg-success/10 text-success' 
                  : 'bg-error/10 text-error'
              }`}>
                {market.changePercent >= 0 ? (
                  <ArrowUp className="inline h-3 w-3 mr-1" />
                ) : (
                  <ArrowDown className="inline h-3 w-3 mr-1" />
                )}
                <span>{(Math.abs(market.changePercent)).toFixed(2)}%</span>
              </span>
              <p className="text-gray-500 text-sm">
                {market.change >= 0 ? '+' : ''}{market.change.toFixed(2)} pts
              </p>
            </div>
          </div>
          
          {market.data && (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart
                data={market.data}
                margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
              >
                <XAxis 
                  dataKey="time"
                  tick={{ fontSize: 10 }}
                  tickFormatter={(tick) => {
                    const date = new Date(tick);
                    return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
                  }}
                  hide
                />
                <YAxis hide domain={['auto', 'auto']} />
                <Tooltip 
                  formatter={(value) => [value, 'Value']}
                  labelFormatter={(label) => new Date(label).toLocaleTimeString()}
                />
                <Line 
                  type="monotone"
                  dataKey="value"
                  stroke={market.changePercent >= 0 ? "#4caf50" : "#f44336"}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </Card>
      ))}
    </div>
  );
}
