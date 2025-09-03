import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth, useUI, useSearch } from '@/store';
import { 
  Search, 
  Bell, 
  LogOut, 
  Wifi, 
  WifiOff, 
  RefreshCw as Sync, 
  AlertTriangle,
  Moon,
  Sun,
  Users,
  GraduationCap,
  CreditCard,
  Calendar,
  X,
  Clock,
  FileText,
  BookOpen
} from 'lucide-react';

export function Header() {
  const { logout, user, tenant } = useAuth();
  const { theme, setTheme, sidebarCollapsed } = useUI();
  const { 
    searchTerm, 
    searchResults, 
    isSearching, 
    searchHistory,
    setSearchTerm, 
    setSearchResults, 
    setIsSearching,
    addToHistory,
    performGlobalSearch
  } = useSearch();
  
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);
  const [syncStatus, setSyncStatus] = React.useState<'idle' | 'syncing' | 'error'>('idle');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchInput, setSearchInput] = useState('');

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

  // Enhanced search functionality
  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (searchInput.trim().length > 2) {
        setIsSearching(true);
        setShowSearchResults(true);
        
        try {
          const results = await performGlobalSearch(searchInput);
          setSearchResults(results);
        } catch (error) {
          console.error('Search error:', error);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
        setShowSearchResults(false);
      }
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [searchInput, performGlobalSearch, setSearchResults, setIsSearching]);

  const handleSearchSelect = (result: any) => {
    addToHistory(searchInput);
    setShowSearchResults(false);
    setSearchInput('');
    
    // Navigate to the appropriate module and set selected item
    window.dispatchEvent(new CustomEvent('navigate', { detail: result.module }));
    
    // Set the selected item in the appropriate store
    setTimeout(() => {
      switch (result.type) {
        case 'student':
          window.dispatchEvent(new CustomEvent('selectStudent', { detail: result.data }));
          break;
        case 'staff':
          window.dispatchEvent(new CustomEvent('selectStaff', { detail: result.data }));
          break;
        case 'invoice':
          window.dispatchEvent(new CustomEvent('selectInvoice', { detail: result.data }));
          break;
        case 'task':
          window.dispatchEvent(new CustomEvent('selectTask', { detail: result.data }));
          break;
      }
    }, 100);
  };

  const handleSync = () => {
    setSyncStatus('syncing');
    // Simulate sync
    setTimeout(() => {
      setSyncStatus(Math.random() > 0.8 ? 'error' : 'idle');
    }, 2000);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  // Apply theme on mount
  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const getSearchIcon = (type: string) => {
    switch (type) {
      case 'student': return Users;
      case 'staff': return GraduationCap;
      case 'invoice': return CreditCard;
      case 'task': return BookOpen;
      case 'attendance': return Calendar;
      case 'module': return FileText;
      default: return FileText;
    }
  };

  return (
    <>
      <header className="bg-background border-b border-border px-3 lg:px-6 py-3 lg:py-4 dark-transition">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 lg:space-x-4 flex-1 min-w-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search students, tasks, invoices..."
                className="pl-10 w-32 sm:w-48 lg:w-80 dark-transition"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onFocus={() => searchInput.length > 2 && setShowSearchResults(true)}
              />
              
              {/* Search Results Dropdown */}
              {showSearchResults && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                  {isSearching ? (
                    <div className="p-4 text-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mx-auto"></div>
                      <p className="text-sm text-muted-foreground mt-2">Searching...</p>
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="py-2">
                      {searchResults.map((result, index) => {
                        const Icon = getSearchIcon(result.type);
                        return (
                          <button
                            key={index}
                            onClick={() => handleSearchSelect(result)}
                            className="w-full px-4 py-3 text-left hover:bg-accent hover:text-accent-foreground flex items-center space-x-3 dark-transition"
                          >
                            <Icon className="h-4 w-4 text-muted-foreground" />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-foreground truncate">{result.title}</p>
                              <p className="text-sm text-muted-foreground truncate">{result.subtitle}</p>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {result.type}
                            </Badge>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-4 text-center">
                      <p className="text-sm text-muted-foreground">No results found</p>
                      {searchHistory.length > 0 && (
                        <div className="mt-3">
                          <p className="text-xs text-muted-foreground mb-2">Recent searches:</p>
                          <div className="flex flex-wrap gap-1">
                            {searchHistory.slice(0, 5).map((term, index) => (
                              <button
                                key={index}
                                onClick={() => setSearchInput(term)}
                                className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded hover:bg-accent"
                              >
                                {term}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
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
                className="text-muted-foreground"
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
              <p className="text-sm font-medium text-foreground">
                Term {tenant?.settings.current_term || 1}, {tenant?.settings.academic_year || '2024'}
              </p>
              <p className="text-xs text-muted-foreground truncate max-w-32 lg:max-w-none">
                {tenant?.name || 'School Name'}
              </p>
            </div>

            {/* Theme Toggle */}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleTheme}
              className="text-muted-foreground hover:text-foreground"
            >
              {theme === 'light' ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </Button>

            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                3
              </Badge>
            </Button>

            <Button variant="ghost" onClick={logout} className="text-muted-foreground hover:text-foreground hidden sm:flex">
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

      {/* Search Results Overlay */}
      {showSearchResults && (
        <div 
          className="fixed inset-0 bg-black/20 z-40"
          onClick={() => setShowSearchResults(false)}
        />
      )}
    </>
  );
}