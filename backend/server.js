require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { testConnection, syncDatabase } = require('./config/db');

// Import routes
const userRoutes = require('./routes/users');
const taskRoutes = require('./routes/tasks');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

// Base route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to TaskTrack API' });
});

// Initialize database
const initializeDatabase = async () => {
  try {
    // Test database connection
    await testConnection();
    
    // Sync models with database (set force to true only in development to drop tables)
    const force = process.env.NODE_ENV === 'development' && process.env.DB_RESET === 'true';
    await syncDatabase(force);
    
    // Start the server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  }
};

// Start the application
initializeDatabase(); 