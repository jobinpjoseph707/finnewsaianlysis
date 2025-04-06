import React from "react";
import Header from "@/components/layouts/Header";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Newspaper, 
  Search, 
  Filter, 
  TrendingUp, 
  TrendingDown, 
  Clock,
  ArrowRight,
  ExternalLink,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useSentiment } from "@/hooks/useSentiment";
import { Skeleton } from "@/components/ui/skeleton";
import { useMCP } from "@/hooks/useMCP";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function News() {
  const { useNews, isDappierMCP } = useMCP();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [dappierSearchTerm, setDappierSearchTerm] = React.useState("indian financial news and reports");
  const [category, setCategory] = React.useState("all");
  
  // Pass the search term to the API query if using Dappier
  const { data: newsItems = [], isLoading: isNewsLoading, isError: isNewsError, refetch } = 
    useNews(10, isDappierMCP ? dappierSearchTerm : undefined);
  const { data: sentimentData, isLoading: isSentimentLoading } = useSentiment();
  
  const isLoading = isNewsLoading || isSentimentLoading;
  
  // Handle search submit for Dappier API
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isDappierMCP && searchTerm.trim()) {
      setDappierSearchTerm(searchTerm.trim());
    }
  };
  
  // Filter news items based on search term (client-side filter if not using Dappier) and category
  const filteredNews = newsItems.filter(news => {
    // If using Dappier, don't filter by search term since it's done on the API side
    const matchesSearch = isDappierMCP ? true :
      news.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (news.summary && news.summary.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // For category matching, check sectors if available
    const matchesCategory = category === "all" || (() => {
      if (news.sectors) {
        // Handle sectors as array or string
        if (Array.isArray(news.sectors)) {
          return news.sectors.some(sector => 
            typeof sector === 'string' && sector.toLowerCase() === category.toLowerCase()
          );
        } else if (typeof news.sectors === 'string') {
          return news.sectors.toLowerCase() === category.toLowerCase();
        }
      }
      // Default to true for "Economy" category since financial news is mostly economic
      return category.toLowerCase() === "economy";
    })();
    
    return matchesSearch && matchesCategory;
  });

  // Function to get sentiment indicator
  const getSentimentBadge = (sentiment) => {
    switch (sentiment.toLowerCase()) {
      case 'positive':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200 flex items-center">
            <TrendingUp className="h-3 w-3 mr-1" />
            Positive
          </Badge>
        );
      case 'negative':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200 flex items-center">
            <TrendingDown className="h-3 w-3 mr-1" />
            Negative
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-600 border-gray-200">
            Neutral
          </Badge>
        );
    }
  };

  // Function to get impact indicator
  const getImpactBadge = (impact) => {
    switch (impact.toLowerCase()) {
      case 'high':
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">
            High Impact
          </Badge>
        );
      case 'medium':
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
            Medium Impact
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-600 border-gray-200">
            Low Impact
          </Badge>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <main className="container mx-auto px-4 py-6 flex-1">
          <h1 className="text-3xl font-bold mb-6 flex items-center">
            <Newspaper className="mr-2 h-8 w-8 text-primary" />
            Financial News Analysis
          </h1>
          
          <div className="grid grid-cols-1 gap-6 mb-6">
            {/* Loading state */}
            <Card className="shadow-sm">
              <CardContent className="p-6">
                <div className="flex flex-col gap-4">
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <div className="flex gap-2 mt-2">
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-6 w-24 rounded-full" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }
  
  if (isNewsError) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <main className="container mx-auto px-4 py-6 flex-1">
          <h1 className="text-3xl font-bold mb-6 flex items-center">
            <Newspaper className="mr-2 h-8 w-8 text-primary" />
            Financial News Analysis
          </h1>
          
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4 mr-2" />
            <AlertTitle>Error Fetching News</AlertTitle>
            <AlertDescription>
              {isDappierMCP 
                ? "Could not retrieve financial news from Dappier API. Please check your API configuration in Settings." 
                : "Could not retrieve news data. Please try again later."}
            </AlertDescription>
          </Alert>
          
          <Card className="shadow-sm">
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">No news available at this time.</p>
              <Button 
                className="mt-4" 
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
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
            <Newspaper className="mr-2 h-8 w-8 text-primary" />
            Financial News Analysis
          </h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card className="bg-gradient-to-br from-blue-500/80 to-blue-600/90 text-white shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-bold">Overall Market Sentiment</h2>
              </div>
              <div className="text-3xl font-bold mb-1">{sentimentData?.overallSentiment || "Moderately Bullish"}</div>
              <div className="text-white/70 text-sm">Based on {sentimentData?.sourceCount || 250}+ sources</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-500/80 to-green-600/90 text-white shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-bold">Most Bullish Sector</h2>
              </div>
              <div className="text-3xl font-bold mb-1">IT / Technology</div>
              <div className="text-white/70 text-sm">+18% positive sentiment this week</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-red-500/80 to-red-600/90 text-white shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-bold">Most Bearish Sector</h2>
              </div>
              <div className="text-3xl font-bold mb-1">Real Estate</div>
              <div className="text-white/70 text-sm">-12% negative sentiment this week</div>
            </CardContent>
          </Card>
        </div>
        
        <Card className="shadow-sm mb-6">
          <CardHeader className="pb-2">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <CardTitle className="text-xl font-bold flex items-center">
                Latest Market News
              </CardTitle>
              
              <div className="flex items-center gap-2">
                <form onSubmit={handleSearchSubmit} className="relative flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input 
                      type="search" 
                      placeholder="Search news..." 
                      className="pl-8 w-full md:w-60"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  {isDappierMCP && (
                    <Button 
                      type="submit" 
                      size="sm" 
                      variant="secondary"
                      className="flex items-center"
                    >
                      Search API
                    </Button>
                  )}
                </form>
                
                <Tabs value={category} onValueChange={setCategory} className="w-full md:w-auto">
                  <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="economy">Economy</TabsTrigger>
                    <TabsTrigger value="markets">Markets</TabsTrigger>
                    <TabsTrigger value="technology">Technology</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              
              {isDappierMCP && dappierSearchTerm && (
                <div className="mt-2 text-sm text-gray-500">
                  <p>
                    Currently searching Dappier API for: <span className="font-medium">{dappierSearchTerm}</span>
                  </p>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {filteredNews.length > 0 ? (
                filteredNews.map((news) => (
                  <div key={news.id} className="p-5 hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold mb-1">{news.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                          <span>{news.source}</span>
                          <span>•</span>
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {news.publishedAt 
                              ? new Date(news.publishedAt).toLocaleDateString('en-US', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric'
                              })
                              : "Recently"
                            }
                          </div>
                          {news.sectors && (
                            <>
                              <span>•</span>
                              <span>{Array.isArray(news.sectors) 
                                ? news.sectors[0]
                                : (typeof news.sectors === 'string' ? news.sectors : 'General')
                              }</span>
                            </>
                          )}
                        </div>
                        <p className="text-gray-600 mb-3">{news.summary}</p>
                        <div className="flex flex-wrap gap-2">
                          {getSentimentBadge(news.sentiment)}
                          {getImpactBadge(news.impact)}
                        </div>
                      </div>
                      <div className="flex-shrink-0 pt-2 md:pt-0">
                        {news.url ? (
                          <a href={news.url} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" size="sm" className="text-primary flex items-center">
                              Read More <ExternalLink className="ml-1 h-3 w-3" />
                            </Button>
                          </a>
                        ) : (
                          <Button variant="outline" size="sm" className="text-primary flex items-center" disabled>
                            No Source <ExternalLink className="ml-1 h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500">
                  No news found matching your search criteria.
                </div>
              )}
            </div>
            
            {filteredNews.length > 0 && (
              <div className="p-4 flex justify-center">
                <Button variant="outline" className="text-primary flex items-center">
                  Load More News <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-bold flex items-center">
              Sentiment Across Sectors
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 divide-x divide-y">
              {(sentimentData?.sectors || []).map((sector, index) => (
                <div key={index} className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold">{sector.name}</h3>
                    {getSentimentBadge(sector.sentiment)}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{sector.summary}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-3 w-3 mr-1" />
                    {sector.lastUpdated}
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