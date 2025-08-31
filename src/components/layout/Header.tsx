import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/store';
import { Search, Bell, LogOut, Wifi, WifiOff, FolderSync as Sync, AlertTriangle } from 'lucide-react';

export function Header() {
  const { logout, user, tenant } = useAuth();
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);
  const [syncStatus, setSyncStatus] = React.useState<'idle' | 'syncing' | 'error'>('idle');

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleSync = () => {
    setSyncStatus('syncing');
    // Simulate sync
    setTimeout(() => {
      setSyncStatus(Math.random() > 0.8 ? 'error' : 'idle');
    }, 2000);
  };

  return (
    <header className="bg-white border-b border-gray-200 px-3 lg:px-6 py-3 lg:py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 lg:space-x-4 flex-1 min-w-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search students, tasks, invoices..."
              className="pl-10 w-32 sm:w-48 lg:w-80"
            />
          </div>
          
          {/* PWA Status Indicators */}
          <div className="hidden sm:flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              {isOnline ? (
                <Wifi className="h-4 w-4 text-green-500" />
              ) : (
                <WifiOff className="h-4 w-4 text-red-500" />
              )}
              <Badge variant={isOnline ? "secondary" : "destructive"}>
                {isOnline ? "Online" : "Offline"}
              </Badge>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleSync}
              disabled={syncStatus === 'syncing'}
              className="text-gray-500"
            >
              <Sync className={`h-4 w-4 ${syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
              {syncStatus === 'syncing' && <span className="ml-2 hidden lg:inline">Syncing...</span>}
            </Button>

            {syncStatus === 'error' && (
              <Badge variant="destructive" className="flex items-center space-x-1">
                <AlertTriangle className="h-3 w-3" />
                <span className="hidden lg:inline">Sync Error</span>
              </Badge>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2 lg:space-x-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-gray-900">
              Term {tenant?.settings.current_term || 1}, {tenant?.settings.academic_year || '2024'}
            </p>
            <p className="text-xs text-gray-500 truncate max-w-32 lg:max-w-none">
              {tenant?.name || 'School Name'}
            </p>
          </div>

          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
              3
            </Badge>
          </Button>

          <Button variant="ghost" onClick={logout} className="text-gray-500 hover:text-gray-900 hidden sm:flex">
            <LogOut className="h-4 w-4 mr-2" />
            <span className="hidden lg:inline">Sign Out</span>
          </Button>
          
          {/* Mobile Sign Out */}
          <Button variant="ghost" size="icon" onClick={logout} className="sm:hidden">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}