import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { userAPI } from '../utils/api';

// Hardcode the same API URL as in api.js
const API_URL = 'http://56.228.10.78';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiUrl, setApiUrl] = useState('');
  
  const navigate = useNavigate();
  
  // Check API URL on load
  useEffect(() => {
    // Use the hardcoded API URL for consistency
    setApiUrl(API_URL);
    console.log('Current API URL:', API_URL);
  }, []);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      console.log('Attempting to register with:', { name, email });
      
      const response = await userAPI.register(name, email, password);
      console.log('Registration successful:', response);
      
      // Store user info in localStorage
      localStorage.setItem('userInfo', JSON.stringify(response));
      localStorage.setItem('token', response.token);
      
      // Redirect to dashboard
      navigate('/tasks');
    } catch (err) {
      console.error('Registration error:', err);
      // More detailed error handling
      if (err.response) {
        console.error('Server response:', err.response.data);
        setError(err.response.data.message || 'Server error occurred');
      } else if (err.request) {
        console.error('No response from server. Request:', err.request);
        setError('Unable to reach the server. Please check your connection.');
      } else {
        console.error('Error message:', err.message);
        setError(err.message || 'Registration failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Row className="justify-content-md-center mt-5">
        <Col xs={12} md={6}>
          <Card className="p-4">
            <h2 className="text-center mb-4">Register</h2>
            
            {apiUrl && process.env.NODE_ENV === 'development' && (
              <Alert variant="info" className="small">
                API URL: {apiUrl}
              </Alert>
            )}
            
            {error && <Alert variant="danger">{error}</Alert>}
            
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="name">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Form.Group>
              
              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>
              
              <Form.Group className="mb-3" controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>
              
              <Form.Group className="mb-3" controlId="confirmPassword">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </Form.Group>
              
              <Button 
                variant="primary" 
                type="submit" 
                className="w-100" 
                disabled={loading}
              >
                {loading ? 'Registering...' : 'Register'}
              </Button>
              
              <div className="mt-3 text-center">
                Already have an account? <Link to="/login">Login</Link>
              </div>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterPage; 