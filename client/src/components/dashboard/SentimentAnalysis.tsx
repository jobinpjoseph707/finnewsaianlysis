import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { 
  SmilePlus, 
  Meh, 
  Frown, 
  ThumbsUp, 
  ThumbsDown, 
  ChevronRight 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSentiment } from "@/hooks/useSentiment";

export default function SentimentAnalysis() {
  const { 
    data: { overallSentiment, newsSentiment, socialSentiment, sectorSentiments, newsAnalysis } = {},
    isLoading, 
    error 
  } = useSentiment();
  
  if (isLoading) {
    return (
      <Card className="p-4">
        <CardHeader className="px-0 pt-0">
          <Skeleton className="h-6 w-48 mb-4" />
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
          <Skeleton className="h-6 w-32 mb-4" />
          <div className="space-y-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i}>
                <div className="flex justify-between mb-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-2 w-full" />
              </div>
            ))}
          </div>
          <Skeleton className="h-6 w-44 mb-4" />
          <div className="space-y-4">
            {[...Array(2)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
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
            Error loading sentiment data: {error instanceof Error ? error.message : "Unknown error"}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Function to get icon for overall sentiment
  const getSentimentIcon = (sentiment: string) => {
    if (!sentiment) return <Meh className="mr-1 h-5 w-5" />;
    
    if (sentiment.toLowerCase().includes('bull') || sentiment.toLowerCase().includes('positive')) {
      return <SmilePlus className="mr-1 h-5 w-5 text-success" />;
    } else if (sentiment.toLowerCase().includes('bear') || sentiment.toLowerCase().includes('negative')) {
      return <Frown className="mr-1 h-5 w-5 text-error" />;
    } else {
      return <Meh className="mr-1 h-5 w-5 text-warning" />;
    }
  };
  
  // Function to get color for sentiment
  const getSentimentColor = (sentiment: string) => {
    if (!sentiment) return "text-gray-500";
    
    if (sentiment.toLowerCase().includes('bull') || sentiment.toLowerCase().includes('positive')) {
      return "text-success";
    } else if (sentiment.toLowerCase().includes('bear') || sentiment.toLowerCase().includes('negative')) {
      return "text-error";
    } else {
      return "text-warning";
    }
  };
  
  // Function to get progress color
  const getProgressColor = (score: number) => {
    if (score >= 70) return "bg-success";
    if (score >= 40) return "bg-warning";
    return "bg-error";
  };
  
  return (
    <Card className="p-4">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-xl font-medium">Market Sentiment Analysis</CardTitle>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-neutral-light p-4 rounded-lg">
            <h3 className="text-sm text-gray-500 mb-1">Overall Sentiment</h3>
            <div className="flex items-center">
              {getSentimentIcon(overallSentiment || '')}
              <span className={`text-xl font-medium ${getSentimentColor(overallSentiment || '')}`}>
                {overallSentiment || 'No data'}
              </span>
            </div>
          </div>
          
          <div className="bg-neutral-light p-4 rounded-lg">
            <h3 className="text-sm text-gray-500 mb-1">News Sentiment</h3>
            <div className="flex items-center">
              {getSentimentIcon(newsSentiment || '')}
              <span className={`text-xl font-medium ${getSentimentColor(newsSentiment || '')}`}>
                {newsSentiment || 'No data'}
              </span>
            </div>
          </div>
          
          <div className="bg-neutral-light p-4 rounded-lg">
            <h3 className="text-sm text-gray-500 mb-1">Social Media</h3>
            <div className="flex items-center">
              {getSentimentIcon(socialSentiment || '')}
              <span className={`text-xl font-medium ${getSentimentColor(socialSentiment || '')}`}>
                {socialSentiment || 'No data'}
              </span>
            </div>
          </div>
        </div>
        
        {sectorSentiments && sectorSentiments.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3">Sector Sentiment</h3>
            <div className="space-y-3">
              {sectorSentiments.map((sector, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">{sector.name}</span>
                    <span className={getSentimentColor(sector.sentiment)}>{sector.sentiment}</span>
                  </div>
                  <Progress 
                    value={sector.score} 
                    max={100} 
                    className="h-2 bg-neutral rounded-full overflow-hidden"
                  >
                    <div 
                      className={`h-full ${getProgressColor(sector.score)} rounded-full`} 
                      style={{ width: `${sector.score}%` }}
                    />
                  </Progress>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {newsAnalysis && newsAnalysis.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-medium">Recent News Analysis</h3>
              <Button variant="link" className="text-primary text-sm p-0">
                View all <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
            
            <div className="space-y-4">
              {newsAnalysis.map((news, index) => (
                <div key={index} className="flex space-x-3 p-3 hover:bg-neutral-light rounded-lg transition-colors">
                  <div className="flex-shrink-0">
                    <div className={`w-10 h-10 rounded-full ${
                      news.sentiment.toLowerCase().includes('positive') 
                        ? 'bg-success/20' 
                        : 'bg-error/20'
                    } flex items-center justify-center`}>
                      {news.sentiment.toLowerCase().includes('positive') ? (
                        <ThumbsUp className="text-success h-5 w-5" />
                      ) : (
                        <ThumbsDown className="text-error h-5 w-5" />
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium">{news.title}</h4>
                    <p className="text-sm text-gray-600">{news.summary}</p>
                    <div className="flex items-center mt-1 text-xs text-gray-500">
                      <span>{news.source}</span>
                      <span className="mx-2">•</span>
                      <span>{news.time}</span>
                      <Badge 
                        variant="outline" 
                        className={`ml-2 ${
                          news.sentiment.toLowerCase().includes('positive')
                            ? 'bg-success/10 text-success border-success/20'
                            : 'bg-error/10 text-error border-error/20'
                        }`}
                      >
                        {news.sentiment}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
