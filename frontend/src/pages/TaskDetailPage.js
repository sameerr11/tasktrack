import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, ListGroup, Alert } from 'react-bootstrap';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaArrowLeft } from 'react-icons/fa';
import Loader from '../components/Loader';
import AttachmentList from '../components/AttachmentList';
import { taskAPI } from '../utils/api';
import { useNotification } from '../context/NotificationContext';

const TaskDetailPage = () => {
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  
  const fetchTask = async () => {
    try {
      setLoading(true);
      const data = await taskAPI.getTaskById(id);
      setTask(data);
    } catch (err) {
      setError(err.message || 'Error fetching task details');
      showNotification('Error loading task', 'danger');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchTask();
  }, [id]);
  
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        setLoading(true);
        await taskAPI.deleteTask(id);
        showNotification('Task deleted successfully');
        navigate('/tasks');
      } catch (err) {
        setError(err.message || 'Error deleting task');
        showNotification('Error deleting task', 'danger');
        setLoading(false);
      }
    }
  };
  
  const getPriorityVariant = (priority) => {
    switch (priority) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'secondary';
    }
  };
  
  const getStatusVariant = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in-progress': return 'primary';
      case 'pending': return 'secondary';
      default: return 'light';
    }
  };
  
  if (loading) return <Loader />;
  
  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">{error}</Alert>
        <Button variant="light" onClick={() => navigate('/tasks')}>
          <FaArrowLeft /> Back to Tasks
        </Button>
      </Container>
    );
  }
  
  return (
    <Container className="mt-4">
      {task && (
        <>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Task Details</h2>
            <div>
              <Link to={`/tasks/${id}/edit`} className="btn btn-primary me-2">
                <FaEdit /> Edit
              </Link>
              <Button variant="danger" onClick={handleDelete}>
                <FaTrash /> Delete
              </Button>
            </div>
          </div>
          
          <Card className="mb-4">
            <Card.Header className="d-flex justify-content-between">
              <h3>{task.title}</h3>
              <div>
                <Badge bg={getStatusVariant(task.status)} className="me-2">
                  {task.status}
                </Badge>
                <Badge bg={getPriorityVariant(task.priority)}>
                  {task.priority} priority
                </Badge>
              </div>
            </Card.Header>
            <Card.Body>
              <Card.Text>{task.description || 'No description provided.'}</Card.Text>
              
              <Row className="mt-4">
                <Col md={6}>
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      <strong>Created By:</strong> {task.createdBy?.name || 'Unknown'}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Assigned To:</strong> {task.assignedTo?.name || 'Unassigned'}
                    </ListGroup.Item>
                  </ListGroup>
                </Col>
                <Col md={6}>
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      <strong>Created At:</strong> {new Date(task.createdAt).toLocaleString()}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Due Date:</strong> {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
                    </ListGroup.Item>
                  </ListGroup>
                </Col>
              </Row>
            </Card.Body>
          </Card>
          
          {/* Attachments section */}
          <AttachmentList 
            taskId={id} 
            attachments={task.Attachments || []} 
            onUpdate={fetchTask}
          />
          
          <div className="mt-4">
            <Link to="/tasks" className="btn btn-light">
              <FaArrowLeft /> Back to Tasks
            </Link>
          </div>
        </>
      )}
    </Container>
  );
};

export default TaskDetailPage; 