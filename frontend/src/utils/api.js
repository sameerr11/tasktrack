import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Helper function to get auth header
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

// Task API functions
export const taskAPI = {
  // Get all tasks with optional filters
  getTasks: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      // Add filter parameters if they exist
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.priority) queryParams.append('priority', filters.priority);
      if (filters.assignedTo) queryParams.append('assignedTo', filters.assignedTo);
      if (filters.page) queryParams.append('page', filters.page);
      if (filters.limit) queryParams.append('limit', filters.limit);
      
      const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
      const response = await axios.get(`${API_URL}/api/tasks${query}`, getAuthHeader());
      
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error fetching tasks');
    }
  },

  // Get task by ID
  getTaskById: async (taskId) => {
    try {
      const response = await axios.get(`${API_URL}/api/tasks/${taskId}`, getAuthHeader());
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error fetching task');
    }
  },

  // Create new task
  createTask: async (taskData) => {
    try {
      const response = await axios.post(`${API_URL}/api/tasks`, taskData, getAuthHeader());
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error creating task');
    }
  },

  // Update task
  updateTask: async (taskId, taskData) => {
    try {
      const response = await axios.put(`${API_URL}/api/tasks/${taskId}`, taskData, getAuthHeader());
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error updating task');
    }
  },

  // Delete task
  deleteTask: async (taskId) => {
    try {
      const response = await axios.delete(`${API_URL}/api/tasks/${taskId}`, getAuthHeader());
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error deleting task');
    }
  },

  // Upload attachment to task
  uploadAttachment: async (taskId, file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await axios.post(
        `${API_URL}/api/tasks/${taskId}/attachments`, 
        formData, 
        {
          ...getAuthHeader(),
          headers: {
            ...getAuthHeader().headers,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error uploading attachment');
    }
  },

  // Delete attachment from task
  deleteAttachment: async (taskId, attachmentId) => {
    try {
      const response = await axios.delete(
        `${API_URL}/api/tasks/${taskId}/attachments/${attachmentId}`,
        getAuthHeader()
      );
      
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error deleting attachment');
    }
  }
};

// User API functions
export const userAPI = {
  // Register user
  register: async (name, email, password) => {
    try {
      const response = await axios.post(`${API_URL}/api/users/register`, {
        name,
        email,
        password
      });
      
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error registering user');
    }
  },

  // Login user
  login: async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/api/users/login`, {
        email,
        password
      });
      
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Invalid email or password');
    }
  },

  // Get user profile
  getProfile: async () => {
    try {
      const response = await axios.get(`${API_URL}/api/users/profile`, getAuthHeader());
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error fetching profile');
    }
  }
}; 