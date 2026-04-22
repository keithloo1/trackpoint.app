import React, { useState } from 'react';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/DashboardPage';
import ClientDashboard from './pages/ClientDashboard'; // Make sure the path is correct!

export default function App() {
  // State to control what we see: 'loggedOut', 'trainer', or 'client'
  // Let's default it to 'client' just so you can see your new page immediately!
  const [currentView, setCurrentView] = useState('client'); 

  // In the future, this will handle real authentication data
  const handleLogin = (userData) => {
    // For now, we'll just force it to the trainer dashboard on login
    setCurrentView('trainer'); 
  };

  return (
    <div className="relative min-h-screen w-full">
      
      {/* --------------------------------------------------- */}
      {/* 🛠️ TEMPORARY DEV CONTROLS (Floating in bottom right) */}
      {/* --------------------------------------------------- */}
      <div className="fixed bottom-6 right-6 z-50 flex gap-3 bg-white/90 backdrop-blur-sm p-3 rounded-2xl shadow-2xl border border-gray-200">
        <button 
          onClick={() => setCurrentView('loggedOut')} 
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${currentView === 'loggedOut' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          Login Page
        </button>
        <button 
          onClick={() => setCurrentView('trainer')} 
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${currentView === 'trainer' ? 'bg-[#0B4550] text-[#E6FF2B]' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          Trainer View
        </button>
        <button 
          onClick={() => setCurrentView('client')} 
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${currentView === 'client' ? 'bg-[#0B4550] text-[#E6FF2B]' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          Client View
        </button>
      </div>

      {/* --------------------------------------------------- */}
      {/* 🚦 THE ROUTER (Shows the correct page based on state) */}
      {/* --------------------------------------------------- */}
      {currentView === 'loggedOut' && <LoginPage onLogin={handleLogin} />}
      {currentView === 'trainer' && <Dashboard />}
      {currentView === 'client' && <ClientDashboard />}

    </div>
  );
}