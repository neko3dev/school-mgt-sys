import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  CheckCircle, 
  AlertTriangle,
  Database,
  Upload,
  Download,
  Clock
} from 'lucide-react';

interface OfflineSyncProps {
  onSyncComplete?: () => void;
}

export function OfflineSync({ onSyncComplete }: OfflineSyncProps) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [syncProgress, setSyncProgress] = useState(0);
  const [pendingChanges, setPendingChanges] = useState(0);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [conflicts, setConflicts] = useState<any[]>([]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Simulate pending changes
    setPendingChanges(Math.floor(Math.random() * 10) + 1);
    setLastSync(new Date(Date.now() - Math.random() * 3600000)); // Random time in last hour

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const performSync = async () => {
    if (!isOnline) return;

    setSyncStatus('syncing');
    setSyncProgress(0);

    try {
      // Simulate sync process
      const steps = [
        'Uploading attendance records...',
        'Syncing assessment evidence...',
        'Downloading student updates...',
        'Resolving conflicts...',
        'Finalizing sync...'
      ];

      for (let i = 0; i < steps.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setSyncProgress(((i + 1) / steps.length) * 100);
      }

      // Simulate some conflicts
      if (Math.random() > 0.7) {
        setConflicts([
          {
            id: 'conflict-1',
            type: 'attendance',
            description: 'Student attendance marked differently offline and online',
            student: 'Grace Wanjiku',
            date: '2024-01-15'
          }
        ]);
      }

      setSyncStatus('success');
      setPendingChanges(0);
      setLastSync(new Date());
      onSyncComplete?.();
    } catch (error) {
      setSyncStatus('error');
    }
  };

  const resolveConflict = (conflictId: string, resolution: 'local' | 'remote') => {
    setConflicts(prev => prev.filter(c => c.id !== conflictId));
  };

  return (
    <div className="space-y-4">
      {/* Connection Status */}
      <Card className={isOnline ? 'border-green-200 bg-green-50' : 'border-orange-200 bg-orange-50'}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {isOnline ? (
                <Wifi className="h-5 w-5 text-green-600" />
              ) : (
                <WifiOff className="h-5 w-5 text-orange-600" />
              )}
              <span className={`font-medium ${isOnline ? 'text-green-800' : 'text-orange-800'}`}>
                {isOnline ? 'Online' : 'Offline Mode'}
              </span>
            </div>
            <Badge variant={isOnline ? 'default' : 'secondary'}>
              {isOnline ? 'Connected' : 'Disconnected'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Sync Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center space-x-2">
              <Database className="h-5 w-5 text-blue-600" />
              <span>Data Synchronization</span>
            </span>
            {isOnline && (
              <Button
                onClick={performSync}
                disabled={syncStatus === 'syncing'}
                size="sm"
              >
                {syncStatus === 'syncing' ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                Sync Now
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Sync Progress */}
          {syncStatus === 'syncing' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Synchronizing data...</span>
                <span>{Math.round(syncProgress)}%</span>
              </div>
              <Progress value={syncProgress} className="w-full" />
            </div>
          )}

          {/* Sync Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-lg font-semibold text-blue-600">{pendingChanges}</div>
              <div className="text-xs text-blue-600">Pending Changes</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-lg font-semibold text-green-600">
                {conflicts.length}
              </div>
              <div className="text-xs text-green-600">Conflicts</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-lg font-semibold text-purple-600">
                {lastSync ? lastSync.toLocaleTimeString() : 'Never'}
              </div>
              <div className="text-xs text-purple-600">Last Sync</div>
            </div>
          </div>

          {/* Status Messages */}
          {syncStatus === 'success' && (
            <div className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-800">
                All data synchronized successfully
              </span>
            </div>
          )}

          {syncStatus === 'error' && (
            <div className="flex items-center space-x-2 p-3 bg-red-50 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <span className="text-sm text-red-800">
                Sync failed. Please try again.
              </span>
            </div>
          )}

          {!isOnline && pendingChanges > 0 && (
            <div className="flex items-center space-x-2 p-3 bg-orange-50 rounded-lg">
              <Clock className="h-4 w-4 text-orange-600" />
              <span className="text-sm text-orange-800">
                {pendingChanges} changes will sync when connection is restored
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Conflicts Resolution */}
      {conflicts.length > 0 && (
        <Card className="border-yellow-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <span>Sync Conflicts</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {conflicts.map((conflict) => (
              <div key={conflict.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-medium text-gray-900">{conflict.type}</h4>
                    <p className="text-sm text-gray-600">{conflict.description}</p>
                    <p className="text-xs text-gray-500">
                      Student: {conflict.student} • Date: {conflict.date}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2 mt-3">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => resolveConflict(conflict.id, 'local')}
                  >
                    Keep Local
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => resolveConflict(conflict.id, 'remote')}
                  >
                    Keep Server
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Offline Capabilities */}
      {!isOnline && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-800">Offline Mode Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-blue-700">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4" />
                <span>Mark attendance (will sync when online)</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4" />
                <span>Capture assessment evidence</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4" />
                <span>View student information</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4" />
                <span>Generate cached reports</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}