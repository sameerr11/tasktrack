import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { FaTasks, FaCloud, FaAws, FaDatabase, FaServer } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const { user } = useAuth();

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} className="text-center mb-5">
          <h1 className="display-4 mb-4">
            <FaTasks className="me-2" /> TaskTrack
          </h1>
          <p className="lead mb-4">
            A cloud-native task management application deployed on AWS
          </p>
          {!user ? (
            <div className="d-flex justify-content-center gap-3">
              <LinkContainer to="/login">
                <Button variant="primary" size="lg">
                  Login
                </Button>
              </LinkContainer>
              <LinkContainer to="/register">
                <Button variant="outline-primary" size="lg">
                  Register
                </Button>
              </LinkContainer>
            </div>
          ) : (
            <LinkContainer to="/tasks">
              <Button variant="primary" size="lg">
                My Tasks
              </Button>
            </LinkContainer>
          )}
        </Col>
      </Row>

      <Row className="mb-5">
        <Col md={4}>
          <Card className="h-100 shadow-sm">
            <Card.Body className="text-center p-4">
              <FaCloud className="text-primary mb-3" size={50} />
              <Card.Title>Cloud Native</Card.Title>
              <Card.Text>
                Built using modern cloud architecture and best practices
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="h-100 shadow-sm">
            <Card.Body className="text-center p-4">
              <FaAws className="text-primary mb-3" size={50} />
              <Card.Title>AWS Powered</Card.Title>
              <Card.Text>
                Leveraging AWS services: EC2, S3, RDS, and Elastic Beanstalk
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="h-100 shadow-sm">
            <Card.Body className="text-center p-4">
              <FaServer className="text-primary mb-3" size={50} />
              <Card.Title>Full Stack</Card.Title>
              <Card.Text>
                Modern MERN stack application with React frontend and Node.js backend
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="justify-content-center">
        <Col md={8} className="text-center">
          <h2 className="mb-4">Features</h2>
          <ul className="list-unstyled">
            <li className="mb-2">✅ User authentication and authorization</li>
            <li className="mb-2">✅ Create, view, edit, and delete tasks</li>
            <li className="mb-2">✅ Upload and manage task attachments via S3</li>
            <li className="mb-2">✅ Filter tasks by status, priority, and assignment</li>
            <li className="mb-2">✅ Responsive design works on all devices</li>
            <li className="mb-2">✅ Deployed on AWS cloud infrastructure</li>
          </ul>
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage; 