import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Component for protected routes
const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  // If not logged in, redirect to login page with return path
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Otherwise, render the protected component
  return children;
};

export default PrivateRoute; 