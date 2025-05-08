import axios from 'axios';

// Hardcode the API URL to ensure it's using the AWS backend
const API_URL = 'http://56.228.10.78';
// const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

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
      
      // Remove Content-Type header to let the browser set it with the boundary parameter
      const authHeader = getAuthHeader();
      
      const response = await axios.post(
        `${API_URL}/api/tasks/${taskId}/attachments`, 
        formData, 
        {
          headers: {
            ...authHeader.headers,
            // Let browser set the correct content type with boundary
          },
          // Add timeout and show upload progress if needed
          timeout: 30000
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Upload error:', error);
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Error uploading attachment'
      );
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
      console.log(`Sending registration request to: ${API_URL}/api/users/register`);
      
      const response = await axios.post(`${API_URL}/api/users/register`, {
        name,
        email,
        password
      });
      
      return response.data;
    } catch (error) {
      console.error('Registration error details:', error);
      
      if (error.response) {
        // The server responded with a status code outside the 2xx range
        console.error('Server error response:', error.response.data);
        throw new Error(error.response.data.message || `Server error: ${error.response.status}`);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
        throw new Error('Could not connect to the server. Please check your network connection.');
      } else {
        // Something happened in setting up the request
        console.error('Request setup error:', error.message);
        throw new Error(error.message || 'Error registering user');
      }
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
  },

  // Update user profile
  updateProfile: async (userData) => {
    try {
      const response = await axios.put(
        `${API_URL}/api/users/profile`, 
        userData, 
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error updating profile');
    }
  }
}; 