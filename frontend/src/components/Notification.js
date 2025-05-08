import React, { useState, useEffect } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';

const Notification = ({ show, message, variant, onClose }) => {
  const [visible, setVisible] = useState(show);
  
  // Auto-close the notification after 3 seconds
  useEffect(() => {
    setVisible(show);
    
    if (show) {
      const timer = setTimeout(() => {
        setVisible(false);
        if (onClose) onClose();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);
  
  return (
    <ToastContainer position="top-end" className="p-3" style={{ zIndex: 1050 }}>
      <Toast 
        onClose={onClose} 
        show={visible} 
        delay={3000} 
        autohide 
        bg={variant || 'success'}
      >
        <Toast.Header>
          <strong className="me-auto">
            {variant === 'danger' ? 'Error' : 'Success'}
          </strong>
        </Toast.Header>
        <Toast.Body className={variant === 'danger' ? '' : 'text-white'}>
          {message}
        </Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

export default Notification; 