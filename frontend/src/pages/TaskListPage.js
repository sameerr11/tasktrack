import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Form, Pagination } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { FaPlus, FaFilter } from 'react-icons/fa';
import TaskCard from '../components/TaskCard';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { taskAPI } from '../utils/api';
import { useNotification } from '../context/NotificationContext';

const TaskListPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTasks, setTotalTasks] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const { showNotification } = useNotification();

  // Filter states
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    limit: 6
  });

  // Load tasks
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const { tasks: taskData, pages, total } = await taskAPI.getTasks({
          ...filters,
          page
        });
        
        setTasks(taskData);
        setTotalPages(pages);
        setTotalTasks(total);
        setError('');
      } catch (error) {
        setError(error.message || 'Failed to load tasks');
        showNotification('Error loading tasks', 'danger');
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [filters, page, showNotification]);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    
    // Reset page when changing filters
    setPage(1);
    
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value
    }));
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo(0, 0);
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      status: '',
      priority: '',
      limit: 6
    });
    setPage(1);
    showNotification('Filters reset');
  };

  // Generate pagination items
  const renderPagination = () => {
    const items = [];
    
    // Previous button
    items.push(
      <Pagination.Prev 
        key="prev" 
        onClick={() => handlePageChange(page - 1)}
        disabled={page === 1}
      />
    );

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
      items.push(
        <Pagination.Item 
          key={i} 
          active={i === page}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </Pagination.Item>
      );
    }

    // Next button
    items.push(
      <Pagination.Next 
        key="next" 
        onClick={() => handlePageChange(page + 1)}
        disabled={page === totalPages}
      />
    );

    return <Pagination>{items}</Pagination>;
  };

  return (
    <>
      <Row className="align-items-center mb-4">
        <Col>
          <h1>My Tasks</h1>
          <p className="text-muted">
            {totalTasks} {totalTasks === 1 ? 'task' : 'tasks'} found
          </p>
        </Col>
        <Col xs="auto">
          <Button
            variant="outline-secondary"
            className="me-2"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FaFilter className="me-1" /> Filter
          </Button>
          <LinkContainer to="/tasks/create">
            <Button variant="primary">
              <FaPlus className="me-1" /> New Task
            </Button>
          </LinkContainer>
        </Col>
      </Row>

      {showFilters && (
        <Row className="mb-4">
          <Col md={12}>
            <div className="bg-light p-3 rounded">
              <Row>
                <Col md={5}>
                  <Form.Group controlId="statusFilter">
                    <Form.Label>Status</Form.Label>
                    <Form.Select
                      name="status"
                      value={filters.status}
                      onChange={handleFilterChange}
                    >
                      <option value="">All Statuses</option>
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={5}>
                  <Form.Group controlId="priorityFilter">
                    <Form.Label>Priority</Form.Label>
                    <Form.Select
                      name="priority"
                      value={filters.priority}
                      onChange={handleFilterChange}
                    >
                      <option value="">All Priorities</option>
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={2} className="d-flex align-items-end">
                  <Button 
                    variant="outline-secondary" 
                    className="mt-3 w-100"
                    onClick={resetFilters}
                  >
                    Reset
                  </Button>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      )}

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : tasks.length === 0 ? (
        <Message variant="info">
          No tasks found. Create a new task to get started!
        </Message>
      ) : (
        <>
          <Row>
            {tasks.map((task) => (
              <Col key={task._id} sm={12} md={6} lg={4} className="mb-4">
                <TaskCard task={task} />
              </Col>
            ))}
          </Row>
          
          {totalPages > 1 && (
            <Row className="justify-content-center mt-4">
              <Col md={8} className="d-flex justify-content-center">
                {renderPagination()}
              </Col>
            </Row>
          )}
        </>
      )}
    </>
  );
};

export default TaskListPage; 