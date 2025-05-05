import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-3 mt-auto">
      <Container>
        <Row>
          <Col className="text-center">
            <p className="mb-0">
              TaskTrack &copy; {new Date().getFullYear()} - Cloud Computing Project
            </p>
            <p className="mb-0 small">
              Powered by AWS: EC2, S3, RDS, Elastic Beanstalk
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer; 