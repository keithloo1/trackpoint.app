import React, { useState } from 'react';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/DashboardPage';
import ClientDashboard from './pages/ClientDashboard'; 

export default function App() {
  // 1. STRICT DEFAULT: Always start at the Login Page
  const [currentView, setCurrentView] = useState('loggedOut'); 

  // 2. AUTH FLOW: When login is successful, route to the dashboard
  const handleLogin = (userData) => {
    // For now, we route directly to Emmanuel's Trainer Dashboard
    setCurrentView('trainer'); 
  };

  return (
    <div className="relative min-h-screen w-full">
      
      {/* 🚦 THE ROUTER (Traffic Control) */}
      {currentView === 'loggedOut' && <LoginPage onLogin={handleLogin} />}
      {currentView === 'trainer' && <Dashboard />}
      
      {/* The Client Dashboard is safely preserved here. 
        Soon, we will trigger this view only when a user visits a specific client URL! 
      */}
      {currentView === 'client' && <ClientDashboard />}

    </div>
  );
}