import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { usePerformance } from "@/hooks/usePerformance";
import { Button } from "@/components/ui/button";

export default function PerformanceTracking() {
  const { data: performance, isLoading, error } = usePerformance();
  
  if (isLoading) {
    return (
      <Card className="p-4">
        <CardHeader className="px-0 pt-0">
          <Skeleton className="h-6 w-48 mb-4" />
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <div className="flex items-center justify-between mb-4">
            <div>
              <Skeleton className="h-4 w-24 mb-1" />
              <Skeleton className="h-8 w-16" />
            </div>
            <Skeleton className="h-16 w-16 rounded-full" />
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
          
          <Skeleton className="h-6 w-36 mb-3" />
          <div className="space-y-3">
            {[...Array(2)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
          
          <div className="mt-4 text-center">
            <Skeleton className="h-6 w-48 mx-auto" />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-error">
            Error loading performance data: {error instanceof Error ? error.message : "Unknown error"}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!performance) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-gray-500">No performance data available</div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="p-4">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-xl font-medium">Strategy Performance</CardTitle>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-sm text-gray-500">Success Rate</span>
            <div className="text-2xl font-medium text-secondary">{performance.successRate}</div>
          </div>
          
          <div className="h-16 w-16">
            <div className="relative h-full w-full flex items-center justify-center">
              <svg className="h-full w-full" viewBox="0 0 36 36">
                <path 
                  className="stroke-current text-neutral" 
                  strokeWidth="3" 
                  fill="none" 
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                  strokeDasharray="100, 100"
                />
                <path 
                  className="stroke-current text-secondary" 
                  strokeWidth="3" 
                  fill="none" 
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                  strokeDasharray={`${parseInt(performance.successRate)}, 100`}
                />
              </svg>
              <div className="absolute text-sm font-medium">{performance.successRate}</div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-neutral-light p-3 rounded-lg">
            <div className="text-sm text-gray-500">Avg. Return</div>
            <div className="text-xl font-medium text-success">{performance.avgReturn}</div>
          </div>
          
          <div className="bg-neutral-light p-3 rounded-lg">
            <div className="text-sm text-gray-500">Active Strategies</div>
            <div className="text-xl font-medium">{performance.activeStrategies}</div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-3">Top Performing</h3>
          
          <div className="space-y-3">
            {performance.topPerforming.map((strategy, index) => (
              <div key={index} className="flex items-center justify-between p-2 hover:bg-neutral-light rounded-lg">
                <div>
                  <div className="font-medium">{strategy.name}</div>
                  <div className="text-xs text-gray-500">{strategy.date}</div>
                </div>
                <div className="text-success font-medium">{strategy.return}</div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-4 text-center">
          <Button variant="link" className="text-primary hover:text-primary-dark text-sm font-medium">
            View Full Performance Report
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
