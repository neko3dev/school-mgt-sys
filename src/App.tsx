import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Dashboard } from './components/Dashboard';
import { LandingPage } from './components/website/LandingPage';
import { useAuth, useUI, initializeAllStores } from './store';
import { LoginPage } from './components/auth/LoginPage';
import Button from './components/ui/button'

function App() {
  const { isAuthenticated } = useAuth();
  const { theme } = useUI();
  const [showLanding, setShowLanding] = React.useState(true);

  // Initialize all stores with realistic data on app start
  React.useEffect(() => {
    initializeAllStores();
  }, []);

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

  if (showLanding) {
    return (
      <div className="min-h-screen bg-background text-foreground dark-transition">
        <LandingPage onEnterDemo={handleEnterDemo} />
      </div>
    );
  }

  return (
    <Router>
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
        
        {isAuthenticated ? <Dashboard /> : <LoginPage />}
      </div>
    </Router>
  );
}

export default App;