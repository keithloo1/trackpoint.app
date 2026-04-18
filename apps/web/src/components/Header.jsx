
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Activity, UserCircle, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext.jsx';
import pb from '@/lib/pocketbaseClient';
import SettingsModal from './SettingsModal.jsx';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, currentUser } = useAuth();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleLogout = () => {
    pb.authStore.clear();
    navigate('/');
  };

  return (
    <>
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-20">
            <div className="flex items-center gap-6 sm:gap-10">
              <Link to="/" className="flex items-center gap-2 group shrink-0">
                <div className="bg-primary text-primary-foreground p-1.5 sm:p-2 rounded-lg group-hover:scale-105 transition-transform shrink-0">
                  <Activity className="w-4 h-4 sm:w-6 sm:h-6" />
                </div>
                <span className="font-bold text-base sm:text-xl tracking-tight text-slate-900 truncate">
                  TRACK<span className="text-primary">POINT</span>
                </span>
              </Link>

              <nav className="hidden md:flex items-center gap-6">
                {isAuthenticated && (
                  <Link
                    to="/dashboard"
                    className={`text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                      location.pathname === '/dashboard' ? 'text-primary' : 'text-slate-600 hover:text-primary'
                    }`}
                  >
                    <Activity className="w-4 h-4" /> Dashboard
                  </Link>
                )}
              </nav>
            </div>

            <div className="flex items-center gap-2 sm:gap-4 shrink-0">
              {!isAuthenticated ? (
                <Link to="/login">
                  <Button variant="outline" className="font-medium h-9 sm:h-10 px-3 sm:px-4 text-xs sm:text-sm">Studio Login</Button>
                </Link>
              ) : (
                <div className="flex items-center gap-1 sm:gap-2 bg-slate-50 sm:bg-transparent rounded-full sm:rounded-none px-1 sm:px-0 py-1 sm:py-0 border border-slate-200 sm:border-none">
                  <div className="flex items-center gap-2 px-2 sm:px-0 hidden lg:flex">
                    <UserCircle className="w-5 h-5 text-slate-400" />
                    <span className="text-sm font-medium text-slate-600 truncate max-w-[150px]">
                      {currentUser?.email}
                    </span>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setIsSettingsOpen(true)} 
                    className="text-slate-500 hover:text-primary hover:bg-primary/10 rounded-full h-10 w-10 sm:h-10 sm:w-10 shrink-0"
                    title="Settings"
                  >
                    <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="sr-only">Settings</span>
                  </Button>

                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={handleLogout} 
                    className="text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-full h-10 w-10 sm:h-10 sm:w-10 shrink-0"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="sr-only">Logout</span>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {isAuthenticated && (
        <SettingsModal open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
      )}
    </>
  );
};

export default Header;
