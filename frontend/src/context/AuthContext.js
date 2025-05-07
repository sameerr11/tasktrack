import React, { createContext, useState, useContext, useEffect } from 'react';
import { userAPI } from '../utils/api';

const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem('token');
        const userInfo = localStorage.getItem('userInfo');
        
        if (token && userInfo) {
          // Set user from localStorage initially
          setUser(JSON.parse(userInfo));
          
          // Verify with API
          try {
            const userData = await userAPI.getProfile();
            setUser({ ...userData, token });
          } catch (err) {
            // If API verification fails, clear storage
            localStorage.removeItem('token');
            localStorage.removeItem('userInfo');
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  // Register new user
  const register = async (name, email, password) => {
    try {
      setError(null);
      const userData = await userAPI.register(name, email, password);
      
      localStorage.setItem('token', userData.token);
      localStorage.setItem('userInfo', JSON.stringify(userData));
      setUser(userData);
      return true;
    } catch (error) {
      setError(error.message || 'An error occurred during registration');
      return false;
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      setError(null);
      const userData = await userAPI.login(email, password);
      
      localStorage.setItem('token', userData.token);
      localStorage.setItem('userInfo', JSON.stringify(userData));
      setUser(userData);
      return true;
    } catch (error) {
      setError(error.message || 'Invalid email or password');
      return false;
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    setUser(null);
  };

  // Get auth header
  const getAuthHeader = () => {
    const token = user?.token || localStorage.getItem('token');
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    register,
    login,
    logout,
    getAuthHeader,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 