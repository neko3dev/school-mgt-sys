import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useDatabase } from '@/hooks/useDatabase';
import { Database, Wifi, WifiOff, RefreshCw, AlertTriangle } from 'lucide-react';

export function DatabaseStatus() {
  const { isConnected, isLoading, error, checkConnection } = useDatabase();

  if (isLoading) {
    return (
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />
            <span className="text-blue-800">Checking database connection...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`border-2 ${isConnected ? 'border-green-200 bg-green-50' : 'border-orange-200 bg-orange-50'}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {isConnected ? (
              <Database className="h-4 w-4 text-green-600" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-orange-600" />
            )}
            <span className={`font-medium ${isConnected ? 'text-green-800' : 'text-orange-800'}`}>
              {isConnected ? 'Database Connected' : 'Offline Mode'}
            </span>
            <Badge variant={isConnected ? 'default' : 'secondary'}>
              {isConnected ? 'Live Data' : 'Mock Data'}
            </Badge>
          </div>
          <Button variant="outline" size="sm" onClick={checkConnection}>
            <RefreshCw className="h-4 w-4 mr-1" />
            Retry
          </Button>
        </div>
        {error && (
          <p className="text-sm text-orange-700 mt-2">{error}</p>
        )}
      </CardContent>
    </Card>
  );
}