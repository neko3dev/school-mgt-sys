import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Dashboard } from './components/Dashboard';
import { useAuth } from './hooks/useAuth';
import { useUI, initializeAllStores } from './store';
import { DataService } from './lib/data-service';

function AppContent() {
  const { user, loading, tenant, signIn } = useAuth();
  const { theme } = useUI();
  const [showLanding, setShowLanding] = React.useState(false);
  const [dataLoading, setDataLoading] = React.useState(false);
  const location = useLocation();

  // Auto-login with demo credentials on mount
  React.useEffect(() => {
    if (!user && !loading) {
      const autoDemoLogin = async () => {
        try {
          setDataLoading(true);
          await signIn('demo@karagita-primary.ac.ke', 'Demo@2024');
        } catch (err) {
          console.error('Demo login failed:', err);
          setDataLoading(false);
        }
      };
      autoDemoLogin();
    }
  }, [user, loading, signIn]);

  // Load data from database when user is authenticated
  React.useEffect(() => {
    if (user) {
      const loadData = async () => {
        setDataLoading(true);
        const timeoutId = setTimeout(() => {
          console.warn('Data loading timeout - using mock data');
          initializeAllStores();
          setDataLoading(false);
        }, 5000);

        try {
          await Promise.race([
            DataService.loadAllData(),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000))
          ]);
          clearTimeout(timeoutId);
          setDataLoading(false);
        } catch (err) {
          clearTimeout(timeoutId);
          console.error('Error loading data:', err);
          initializeAllStores();
          setDataLoading(false);
        }
      };
      loadData();
    }
  }, [user]);

  // Apply theme class to document
  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

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

  // Show main dashboard for authenticated users
  return (
    <div className="min-h-screen bg-background text-foreground dark-transition">
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