import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import { FaSignInAlt } from 'react-icons/fa';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { login, user, error, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get redirect path from location state or default to tasks
  const from = location.state?.from?.pathname || '/tasks';

  // If user is already logged in, redirect
  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
    
    // Clear any previous errors
    clearError();
  }, [user, navigate, from, clearError]);

  // Set error message from context
  useEffect(() => {
    if (error) {
      setErrorMessage(error);
    }
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      // Login with credentials
      const success = await login(email, password);
      
      if (success) {
        // Redirect on success
        navigate(from, { replace: true });
      }
    } catch (error) {
      setErrorMessage(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Row className="justify-content-md-center my-5">
      <Col md={6} lg={5}>
        <Card className="p-4 shadow">
          <h1 className="text-center mb-4">
            <FaSignInAlt className="me-2" /> Login
          </h1>
          
          {errorMessage && (
            <Message variant="danger" dismissible>
              {errorMessage}
            </Message>
          )}
          
          {loading ? (
            <Loader />
          ) : (
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-4" controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>

              <Button variant="primary" type="submit" className="w-100 mb-3">
                Login
              </Button>
              
              <div className="text-center mt-3">
                <span>Don't have an account? </span>
                <Link to="/register">Register</Link>
              </div>
            </Form>
          )}
        </Card>
      </Col>
    </Row>
  );
};

export default LoginPage; 