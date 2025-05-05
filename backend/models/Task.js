const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');

// Define Task model with Sequelize
const Task = sequelize.define('Task', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'in-progress', 'completed'),
    defaultValue: 'pending'
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high'),
    defaultValue: 'medium'
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  timestamps: true
});

// Define Attachment model for task attachments
const Attachment = sequelize.define('Attachment', {
  fileName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fileUrl: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fileType: {
    type: DataTypes.STRING,
    allowNull: false
  },
  s3Key: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  timestamps: true
});

// Define relationships
Task.belongsTo(User, { as: 'createdBy', foreignKey: { allowNull: false } });
Task.belongsTo(User, { as: 'assignedTo', foreignKey: { allowNull: true } });
Task.hasMany(Attachment, { onDelete: 'CASCADE' });
Attachment.belongsTo(Task);

module.exports = { Task, Attachment }; 