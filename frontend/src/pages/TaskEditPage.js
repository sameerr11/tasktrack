import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import axios from 'axios';
import Loader from '../components/Loader';

const TaskEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('pending');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [users, setUsers] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [loadingTask, setLoadingTask] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [error, setError] = useState('');
  
  // Get auth token from local storage
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  const config = {
    headers: {
      Authorization: `Bearer ${userInfo.token}`
    }
  };
  
  // Fetch task data
  useEffect(() => {
    const fetchTask = async () => {
      try {
        setLoadingTask(true);
        const { data } = await axios.get(`/api/tasks/${id}`, config);
        
        setTitle(data.title);
        setDescription(data.description || '');
        setStatus(data.status);
        setPriority(data.priority);
        setDueDate(data.dueDate ? data.dueDate.split('T')[0] : '');
        setAssignedTo(data.assignedTo?.id || '');
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching task');
      } finally {
        setLoadingTask(false);
      }
    };
    
    fetchTask();
  }, [id]);
  
  // Fetch users for assignment dropdown
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoadingUsers(true);
        const { data } = await axios.get('/api/users', config);
        setUsers(data);
      } catch (err) {
        console.error('Error fetching users:', err);
      } finally {
        setLoadingUsers(false);
      }
    };
    
    fetchUsers();
  }, []);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError('');
      
      const taskData = {
        title,
        description,
        status,
        priority,
        dueDate: dueDate || null,
        assignedTo: assignedTo || null
      };
      
      await axios.put(`/api/tasks/${id}`, taskData, config);
      navigate(`/tasks/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating task');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Container className="mt-4">
      <Row>
        <Col lg={8} className="mx-auto">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Edit Task</h2>
            <Link to={`/tasks/${id}`} className="btn btn-light">
              <FaArrowLeft /> Back to Task
            </Link>
          </div>
          
          {loadingTask ? (
            <Loader />
          ) : error ? (
            <Alert variant="danger">{error}</Alert>
          ) : (
            <Card>
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="title">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter task title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-3" controlId="description">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Enter task description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </Form.Group>
                  
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3" controlId="status">
                        <Form.Label>Status</Form.Label>
                        <Form.Select 
                          value={status}
                          onChange={(e) => setStatus(e.target.value)}
                        >
                          <option value="pending">Pending</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    
                    <Col md={6}>
                      <Form.Group className="mb-3" controlId="priority">
                        <Form.Label>Priority</Form.Label>
                        <Form.Select 
                          value={priority}
                          onChange={(e) => setPriority(e.target.value)}
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3" controlId="dueDate">
                        <Form.Label>Due Date</Form.Label>
                        <Form.Control
                          type="date"
                          value={dueDate}
                          onChange={(e) => setDueDate(e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                    
                    <Col md={6}>
                      <Form.Group className="mb-3" controlId="assignedTo">
                        <Form.Label>Assign To</Form.Label>
                        {loadingUsers ? (
                          <Loader size="sm" />
                        ) : (
                          <Form.Select 
                            value={assignedTo}
                            onChange={(e) => setAssignedTo(e.target.value)}
                          >
                            <option value="">Unassigned</option>
                            {users.map(user => (
                              <option key={user.id} value={user.id}>
                                {user.name}
                              </option>
                            ))}
                          </Form.Select>
                        )}
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <div className="d-grid">
                    <Button 
                      variant="primary" 
                      type="submit" 
                      disabled={loading}
                      className="mt-3"
                    >
                      {loading ? 'Updating...' : 'Update Task'}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default TaskEditPage; 