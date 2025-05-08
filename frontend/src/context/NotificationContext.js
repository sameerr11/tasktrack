import React, { createContext, useState, useContext } from 'react';
import Notification from '../components/Notification';

// Create the context
const NotificationContext = createContext();

// Provider component
export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    variant: 'success'
  });

  const showNotification = (message, variant = 'success') => {
    setNotification({ show: true, message, variant });
  };

  const hideNotification = () => {
    setNotification({ ...notification, show: false });
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      {notification.show && (
        <Notification
          show={notification.show}
          message={notification.message}
          variant={notification.variant}
          onClose={hideNotification}
        />
      )}
    </NotificationContext.Provider>
  );
};

// Custom hook to use the notification context
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export default NotificationContext; 