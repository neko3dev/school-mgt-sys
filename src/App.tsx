import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Dashboard } from './components/Dashboard';
import { useAuth, useUI } from './store';
import { LoginPage } from './components/auth/LoginPage';

function App() {
  const { isAuthenticated } = useAuth();
  const { theme } = useUI();

  // Apply theme class to document
  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <Router>
      <div className="min-h-screen bg-background text-foreground dark-transition">
        {isAuthenticated ? <Dashboard /> : <LoginPage />}
      </div>
    </Router>
  );
}

export default App;