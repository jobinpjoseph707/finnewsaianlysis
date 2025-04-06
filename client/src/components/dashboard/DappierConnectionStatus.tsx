import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, X, AlertTriangle, Loader2 } from 'lucide-react';
import { useDappierConnection } from '@/hooks/useDappierConnection';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Link } from 'wouter';

export default function DappierConnectionStatus() {
  const { isConnected, isLoading, checkConnection } = useDappierConnection();
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium flex items-center">
          Dappier Financial API Connection
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isLoading ? (
              <div className="flex items-center">
                <Loader2 className="h-5 w-5 text-blue-500 animate-spin mr-2" />
                <span className="text-sm text-gray-600">Checking...</span>
              </div>
            ) : isConnected ? (
              <div className="flex items-center">
                <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center">
                  <Check className="h-3 w-3 text-green-600" />
                </div>
                <span className="ml-2 text-sm text-gray-600">Connected to Dappier API</span>
              </div>
            ) : (
              <div className="flex items-center">
                <div className="h-5 w-5 rounded-full bg-red-100 flex items-center justify-center">
                  <X className="h-3 w-3 text-red-600" />
                </div>
                <span className="ml-2 text-sm text-gray-600">Not connected</span>
              </div>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              className={cn(
                "text-xs",
                isLoading && "opacity-50 cursor-not-allowed"
              )}
              onClick={() => !isLoading && checkConnection()}
              disabled={isLoading}
            >
              {isLoading ? 'Checking...' : 'Check Connection'}
            </Button>
            
            <Link to="/settings">
              <Button size="sm" variant="outline" className="text-xs">
                Configure
              </Button>
            </Link>
          </div>
        </div>
        
        {!isConnected && !isLoading && (
          <div className="mt-2 flex items-start">
            <AlertTriangle className="h-4 w-4 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-gray-500">
              Dappier API is not connected. Configure the API key in Settings to access specialized financial news for the Indian market.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}