import React from 'react';
import { 
  Card, 
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useDappierConnection } from '@/hooks/useDappierConnection';

export function DappierConnectionStatus() {
  const { isConnected, isLoading, error, checkConnection } = useDappierConnection();

  return (
    <Card className="shadow-sm h-full">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base font-medium flex items-center">
              <BookOpen className="mr-2 h-4 w-4 text-purple-500" />
              Dappier News API
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Financial news data source
            </CardDescription>
          </div>
          
          {isLoading ? (
            <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200 flex items-center">
              <Loader2 className="mr-1 h-3 w-3 animate-spin" /> Checking...
            </Badge>
          ) : isConnected ? (
            <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200 flex items-center">
              <CheckCircle className="mr-1 h-3 w-3" /> Connected
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200 flex items-center">
              <XCircle className="mr-1 h-3 w-3" /> Disconnected
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="text-sm">
          {isConnected ? (
            <p className="text-green-700">
              Dappier service is providing real-time financial news data for Indian markets.
            </p>
          ) : (
            <div>
              <p className="text-amber-700 mb-1">
                Using simulated financial news data. 
              </p>
              <p className="text-xs text-muted-foreground">
                Configure the Dappier API in Settings to access real-time Indian financial news.
              </p>
              {error && (
                <p className="text-xs text-red-600 mt-1">
                  Error: {error}
                </p>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}