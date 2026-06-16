// client/src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

// Create a context so that any component in the app can access authentication status
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // 'user' holds the currently logged-in user's profile and credentials
  const [user, setUser] = useState(null);
  // 'loading' tracks whether we are still restoring the session from localStorage on app boot
  const [loading, setLoading] = useState(true);

  // Run on mount to check if the user was already logged in (session persistence)
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        // If credentials exist in local storage, restore them into state
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
        // Clean up broken storage keys to avoid loop errors
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []); // Empty dependency array = runs exactly once on mount

  // Authenticate user via email and password, store credentials, and update app state
  const login = async (email, password) => {
    try {
      const response = await authAPI.login(email, password);
      const userData = response.data;
      
      setUser(userData);
      localStorage.setItem('token', userData.token);
      localStorage.setItem('user', JSON.stringify(userData));
      return userData;
    } catch (error) {
      // Pass the specific backend error message back to the UI (like Login.jsx)
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  // Submit registration data. Note: staff accounts start as unapproved (isApproved = false)
  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      const newUser = response.data;
      // We don't log them in automatically. We redirect them to log in manually.
      return newUser;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  };

  // Log out by flushing states and clearing storage keys
  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  // Helper to dynamically update the user state in both react memory and localStorage
  const updateUser = (updatedFields) => {
    setUser(prev => {
      const next = { ...prev, ...updatedFields };
      localStorage.setItem('user', JSON.stringify(next));
      return next;
    });
  };

  // Expose auth helper functions and state variables to all children components
  const value = {
    user,
    login,
    register,
    logout,
    updateUser,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};