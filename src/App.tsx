import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Dashboard } from './components/Dashboard';
import { useAuth } from './store';
import { LoginPage } from './components/auth/LoginPage';

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {isAuthenticated ? <Dashboard /> : <LoginPage />}
      </div>
    </Router>
  );
}

export default App;