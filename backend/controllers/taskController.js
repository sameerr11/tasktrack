const { Task, Attachment } = require('../models/Task');
const User = require('../models/User');
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const { Op } = require('sequelize');

// Configure AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, assignedTo } = req.body;

    // Create task
    const task = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate: dueDate ? new Date(dueDate) : null,
      assignedToId: assignedTo || null,
      createdById: req.user.id
    });

    // Fetch the created task with associations
    const populatedTask = await Task.findByPk(task.id, {
      include: [
        { model: User, as: 'assignedTo', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'createdBy', attributes: ['id', 'name', 'email'] }
      ]
    });

    res.status(201).json(populatedTask);
  } catch (error) {
    console.error('Create task error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
  try {
    // Filter options
    const filter = {};
    const include = [
      { model: User, as: 'assignedTo', attributes: ['id', 'name', 'email'] },
      { model: User, as: 'createdBy', attributes: ['id', 'name', 'email'] }
    ];
    
    // Add filter for assigned user if provided
    if (req.query.assignedTo) {
      filter.assignedToId = req.query.assignedTo;
    }
    
    // Add filter for status if provided
    if (req.query.status) {
      filter.status = req.query.status;
    }

    // Add filter for priority if provided
    if (req.query.priority) {
      filter.priority = req.query.priority;
    }

    // Regular users can only see tasks created by or assigned to them
    if (req.user.role !== 'admin') {
      filter[Op.or] = [
        { createdById: req.user.id },
        { assignedToId: req.user.id }
      ];
    }

    // Get tasks with pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows: tasks } = await Task.findAndCountAll({
      where: filter,
      include: include,
      order: [['createdAt', 'DESC']],
      offset,
      limit
    });

    res.json({
      tasks,
      page,
      pages: Math.ceil(count / limit),
      total: count
    });
  } catch (error) {
    console.error('Get tasks error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get a task by ID
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id, {
      include: [
        { model: User, as: 'assignedTo', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'createdBy', attributes: ['id', 'name', 'email'] },
        { model: Attachment }
      ]
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user has access to this task
    if (
      req.user.role !== 'admin' &&
      task.createdById !== req.user.id &&
      (!task.assignedToId || task.assignedToId !== req.user.id)
    ) {
      return res.status(403).json({ message: 'Not authorized to access this task' });
    }

    res.json(task);
  } catch (error) {
    console.error('Get task error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, assignedTo } = req.body;

    const task = await Task.findByPk(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user has permission to update
    if (req.user.role !== 'admin' && task.createdById !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this task' });
    }

    // Update fields
    task.title = title || task.title;
    task.description = description !== undefined ? description : task.description;
    task.status = status || task.status;
    task.priority = priority || task.priority;
    task.dueDate = dueDate ? new Date(dueDate) : task.dueDate;
    task.assignedToId = assignedTo || task.assignedToId;

    await task.save();

    // Fetch the updated task with associations
    const updatedTask = await Task.findByPk(task.id, {
      include: [
        { model: User, as: 'assignedTo', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'createdBy', attributes: ['id', 'name', 'email'] }
      ]
    });

    res.json(updatedTask);
  } catch (error) {
    console.error('Update task error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id, {
      include: [{ model: Attachment }]
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user has permission to delete
    if (req.user.role !== 'admin' && task.createdById !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this task' });
    }

    // Delete attachments from S3 if they exist
    if (task.Attachments && task.Attachments.length > 0) {
      const deletePromises = task.Attachments.map(attachment => {
        const params = {
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: attachment.s3Key
        };
        return s3.deleteObject(params).promise();
      });

      await Promise.all(deletePromises);
    }

    await task.destroy();

    res.json({ message: 'Task removed' });
  } catch (error) {
    console.error('Delete task error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Upload attachment to a task
// @route   POST /api/tasks/:id/attachments
// @access  Private
const uploadAttachment = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user has permission
    if (req.user.role !== 'admin' && 
        task.createdById !== req.user.id &&
        (!task.assignedToId || task.assignedToId !== req.user.id)) {
      return res.status(403).json({ message: 'Not authorized to update this task' });
    }

    // Handle file upload
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Create unique filename
    const fileKey = `attachments/${uuidv4()}-${req.file.originalname}`;

    // Upload to S3
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: fileKey,
      Body: req.file.buffer,
      ContentType: req.file.mimetype
    };

    const s3Response = await s3.upload(params).promise();

    // Add attachment to task
    const attachment = await Attachment.create({
      fileName: req.file.originalname,
      fileUrl: s3Response.Location,
      fileType: req.file.mimetype,
      s3Key: fileKey,
      TaskId: task.id
    });

    res.status(201).json({
      message: 'Attachment uploaded successfully',
      attachment
    });
  } catch (error) {
    console.error('Upload attachment error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete an attachment from a task
// @route   DELETE /api/tasks/:id/attachments/:attachmentId
// @access  Private
const deleteAttachment = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user has permission
    if (req.user.role !== 'admin' && task.createdById !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete attachments' });
    }

    // Find attachment
    const attachment = await Attachment.findOne({
      where: {
        id: req.params.attachmentId,
        TaskId: task.id
      }
    });

    if (!attachment) {
      return res.status(404).json({ message: 'Attachment not found' });
    }

    // Delete from S3
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: attachment.s3Key
    };

    await s3.deleteObject(params).promise();

    // Remove from database
    await attachment.destroy();

    res.json({ message: 'Attachment deleted' });
  } catch (error) {
    console.error('Delete attachment error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  uploadAttachment,
  deleteAttachment
}; 