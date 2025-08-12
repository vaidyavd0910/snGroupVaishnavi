import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

// Create the auth context
const AuthContext = createContext(null);

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Provider component that wraps your app and makes auth object available to any
// child component that calls useAuth().
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      if (authService.isAuthenticated()) {
        try {
          const userData = await authService.getCurrentUser();
          setCurrentUser(userData);
        } catch (error) {
          console.error('Error initializing auth:', error);
          authService.logout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (token) => {
    localStorage.setItem('token', token);
    const userData = await authService.getCurrentUser();
    setCurrentUser(userData);
  };

  const logout = () => {
    authService.logout();
    setCurrentUser(null);
  };

  // Create value object to be provided to consumers
  const value = {
    currentUser,
    loading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 