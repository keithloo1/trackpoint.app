
import React, { createContext, useContext, useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient';
import { toast } from 'sonner';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(pb.authStore.model);
  const [isAuthenticated, setIsAuthenticated] = useState(pb.authStore.isValid);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (pb.authStore.isValid) {
        try {
          await pb.collection('users').authRefresh({ $autoCancel: false });
          setCurrentUser(pb.authStore.model);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Auth refresh failed:', error);
          pb.authStore.clear();
          setCurrentUser(null);
          setIsAuthenticated(false);
        }
      }
      setInitialLoading(false);
    };

    checkAuth();

    const unsubscribe = pb.authStore.onChange((token, model) => {
      setCurrentUser(model);
      setIsAuthenticated(!!model);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    try {
      const authData = await pb.collection('users').authWithPassword(email, password, { $autoCancel: false });
      setCurrentUser(authData.record);
      setIsAuthenticated(true);
      toast.success('Logged in successfully');
      return authData;
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.message || 'Failed to log in. Please check your credentials.');
      throw error;
    }
  };

  const signup = async (email, password, passwordConfirm) => {
    try {
      await pb.collection('users').create({
        email,
        password,
        passwordConfirm,
      }, { $autoCancel: false });
      
      // Auto login after signup
      await login(email, password);
      toast.success('Account created successfully');
    } catch (error) {
      console.error('Signup error:', error);
      toast.error(error.message || 'Failed to create account.');
      throw error;
    }
  };

  const logout = () => {
    pb.authStore.clear();
    setCurrentUser(null);
    setIsAuthenticated(false);
    toast.success('Logged out successfully');
    // Force redirect to login to prevent clients from accessing owner dashboard or getting stuck
    window.location.href = '/login';
  };

  const requestPasswordReset = async (email) => {
    try {
      await pb.collection('users').requestPasswordReset(email, { $autoCancel: false });
      toast.success('Password reset email sent. Please check your inbox.');
    } catch (error) {
      console.error('Password reset error:', error);
      toast.error(error.message || 'Failed to send password reset email.');
      throw error;
    }
  };

  const value = {
    currentUser,
    isAuthenticated,
    login,
    signup,
    logout,
    requestPasswordReset,
    initialLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
