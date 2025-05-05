import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaHome, FaTasks } from 'react-icons/fa';

const NotFoundPage = () => {
  return (
    <Container className="py-5 text-center">
      <Row className="justify-content-center">
        <Col md={6}>
          <div className="mb-4">
            <h1 className="display-1">404</h1>
            <h2>Page Not Found</h2>
          </div>
          <p className="lead mb-5">
            The page you are looking for might have been removed, had its name changed,
            or is temporarily unavailable.
          </p>
          <div className="d-flex justify-content-center gap-3">
            <Link to="/" className="btn btn-primary">
              <FaHome className="me-2" /> Go Home
            </Link>
            <Link to="/tasks" className="btn btn-secondary">
              <FaTasks className="me-2" /> Task List
            </Link>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default NotFoundPage; 