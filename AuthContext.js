import React, { createContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { auth } from './api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on app start
  useEffect(() => {
    bootstrapAsync();
  }, []);

  const bootstrapAsync = async () => {
    try {
      const token = await SecureStore.getItemAsync('authToken');
      if (token) {
        // Try to get current user
        const response = await auth.getMe();
        setUser(response.data);
      }
    } catch (error) {
      console.error('Bootstrap error:', error);
      // Clear token if invalid
      await SecureStore.deleteItemAsync('authToken');
    } finally {
      setLoading(false);
    }
  };

  const register = async (username, email, password) => {
    try {
      setError(null);
      const response = await auth.register(username, email, password);
      const { user, token } = response.data;
      
      await SecureStore.setItemAsync('authToken', token);
      setUser(user);
      return user;
    } catch (error) {
      const message = error.response?.data?.error || error.message;
      setError(message);
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await auth.login(email, password);
      const { user, token } = response.data;
      
      await SecureStore.setItemAsync('authToken', token);
      setUser(user);
      return user;
    } catch (error) {
      const message = error.response?.data?.error || error.message;
      setError(message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync('authToken');
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value = {
    user,
    loading,
    error,
    register,
    login,
    logout,
    isSignedIn: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
