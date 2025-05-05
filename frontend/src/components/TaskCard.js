import React from 'react';
import { Card, Badge, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { FaClock, FaUser, FaTag } from 'react-icons/fa';

const TaskCard = ({ task }) => {
  // Status badge color
  const getBadgeVariant = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'in-progress':
        return 'primary';
      case 'completed':
        return 'success';
      default:
        return 'secondary';
    }
  };

  // Priority badge color
  const getPriorityVariant = (priority) => {
    switch (priority) {
      case 'high':
        return 'danger';
      case 'medium':
        return 'warning';
      case 'low':
        return 'info';
      default:
        return 'secondary';
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Card className="my-3">
      <Card.Body>
        <Card.Title>{task.title}</Card.Title>
        <Card.Text>{task.description}</Card.Text>
        
        <div className="d-flex justify-content-between mb-3">
          <Badge bg={getBadgeVariant(task.status)} className="p-2">
            {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
          </Badge>
          
          <Badge bg={getPriorityVariant(task.priority)} className="p-2">
            <FaTag className="me-1" />
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
          </Badge>
        </div>
        
        <div className="d-flex justify-content-between align-items-center mb-3">
          <small className="text-muted">
            <FaClock className="me-1" />
            Due: {formatDate(task.dueDate)}
          </small>
          
          {task.assignedTo && (
            <small className="text-muted">
              <FaUser className="me-1" />
              Assigned to: {task.assignedTo.name}
            </small>
          )}
        </div>
        
        <div className="d-flex justify-content-end">
          <LinkContainer to={`/tasks/${task._id}`}>
            <Button variant="outline-primary" size="sm" className="me-2">
              View Details
            </Button>
          </LinkContainer>
          
          <LinkContainer to={`/tasks/${task._id}/edit`}>
            <Button variant="outline-secondary" size="sm">
              Edit
            </Button>
          </LinkContainer>
        </div>
      </Card.Body>
    </Card>
  );
};

export default TaskCard; 