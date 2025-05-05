import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

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
        
        if (token) {
          const config = {
            headers: {
              Authorization: `Bearer ${token}`
            }
          };
          
          const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/profile`, config);
          setUser({ ...res.data, token });
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        localStorage.removeItem('token');
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
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/users/register`, 
        { name, email, password }
      );
      
      const { token } = res.data;
      localStorage.setItem('token', token);
      setUser(res.data);
      return true;
    } catch (error) {
      setError(
        error.response?.data?.message || 
        'An error occurred during registration'
      );
      return false;
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      setError(null);
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/users/login`, 
        { email, password }
      );
      
      const { token } = res.data;
      localStorage.setItem('token', token);
      setUser(res.data);
      return true;
    } catch (error) {
      setError(
        error.response?.data?.message || 
        'Invalid email or password'
      );
      return false;
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
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