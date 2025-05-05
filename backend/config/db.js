const { Sequelize } = require('sequelize');
require('dotenv').config();

// Create Sequelize instance with RDS connection parameters
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER, 
  process.env.DB_PASSWORD, 
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    dialect: process.env.DB_DIALECT || 'postgres', // 'postgres' or 'mysql'
    dialectOptions: {
      ssl: process.env.NODE_ENV === 'production' ? {
        require: true,
        rejectUnauthorized: false
      } : false
    },
    logging: false
  }
);

// Test the connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

// Sync models with database
const syncDatabase = async (force = false) => {
  try {
    await sequelize.sync({ force });
    console.log('Database synced');
  } catch (error) {
    console.error('Error syncing database:', error);
    process.exit(1);
  }
};

module.exports = {
  sequelize,
  testConnection,
  syncDatabase
}; 