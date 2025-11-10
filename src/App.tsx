import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Dashboard } from './components/Dashboard';
import { LandingPage } from './components/website/LandingPage';
import { LoginPage } from './components/auth/LoginPage';
import { useAuth } from './hooks/useAuth';
import { useUI, initializeAllStores } from './store';
import { Button } from './components/ui/button';
import { DataService } from './lib/data-service';
import { supabase } from './lib/supabase';

function AppContent() {
  const { user, loading, tenant, signIn } = useAuth();
  const { theme } = useUI();
  const [showLanding, setShowLanding] = React.useState(true);
  const [dataLoading, setDataLoading] = React.useState(false);
  const location = useLocation();

  // Handle /demo route - auto-login with demo credentials
  React.useEffect(() => {
    if (location.pathname === '/demo' && !user && !loading) {
      const autoDemoLogin = async () => {
        try {
          setDataLoading(true);
          await signIn('demo@karagita-primary.ac.ke', 'Demo@2024');
        } catch (err) {
          console.error('Demo login failed:', err);
        }
      };
      autoDemoLogin();
    }
  }, [location.pathname, user, loading, signIn]);

  // Load data from database when user is authenticated
  React.useEffect(() => {
    if (user && tenant) {
      const loadData = async () => {
        setDataLoading(true);
        const success = await DataService.loadAllData();
        if (!success) {
          initializeAllStores();
        }
        setDataLoading(false);
      };
      loadData();
    }
  }, [user, tenant]);

  // Apply theme class to document
  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const handleEnterDemo = () => {
    setShowLanding(false);
  };

  const handleBackToWebsite = () => {
    setShowLanding(true);
  };

  // Show loading state
  if (loading || dataLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">
            {loading ? 'Loading your school...' : 'Loading data from database...'}
          </p>
        </div>
      </div>
    );
  }

  // Show landing page for non-authenticated users or when explicitly requested
  if (showLanding || !user) {
    return (
      <div className="min-h-screen bg-background text-foreground dark-transition">
        <LandingPage onEnterDemo={handleEnterDemo} />
      </div>
    );
  }

  // Show main dashboard for authenticated users
  return (
    <div className="min-h-screen bg-background text-foreground dark-transition">
      {/* Back to Website Button */}
      <div className="fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={handleBackToWebsite}
          className="bg-background/95 backdrop-blur-sm border-border shadow-md"
        >
          ← Back to Website
        </Button>
      </div>

      <Dashboard />
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="*" element={<AppContent />} />
      </Routes>
    </Router>
  );
}

export default App;