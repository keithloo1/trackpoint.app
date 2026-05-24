import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './supabaseClient'; 
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/DashboardPage';
import ClientDashboard from './pages/ClientDashboard'; 

export default function App() {
  const [session, setSession] = useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    // 1. Check if a user is already logged in when the app first loads
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsCheckingAuth(false);
    });

    // 2. Listen for any login or logout events in real-time
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // Cleanup the listener when the app closes
    return () => subscription.unsubscribe();
  }, []);

  // Show a blank screen or spinner for a split second while we check Supabase
  if (isCheckingAuth) {
    return <div className="min-h-screen bg-[#F9F7F2] flex items-center justify-center text-[#0B4550] font-medium text-xl">Loading TrackPoint...</div>;
  }

  return (
    <Router>
      <div className="relative min-h-screen w-full">
        <Routes>
          
          {/* 🚦 TRAFFIC CONTROL: If they just type localhost:5173, route them based on auth */}
          <Route path="/" element={session ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
          
          {/* 🚪 THE FRONT DOOR: Only accessible if you are NOT logged in */}
          <Route path="/login" element={!session ? <LoginPage /> : <Navigate to="/dashboard" />} />
          
          {/* 🏋️ TRAINER HQ: Only accessible if you ARE logged in */}
          <Route path="/dashboard" element={session ? <Dashboard session={session} /> : <Navigate to="/login" />} />
          
          {/* 📱 CLIENT PORTAL: A public route that uses the unique Client ID in the URL */}
          <Route path="/client/:clientId" element={<ClientDashboard />} />

        </Routes>
      </div>
    </Router>
  );
}