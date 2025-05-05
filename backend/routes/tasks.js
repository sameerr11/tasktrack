const express = require('express');
const router = express.Router();
const multer = require('multer');
const { 
  createTask, 
  getTasks, 
  getTaskById, 
  updateTask, 
  deleteTask,
  uploadAttachment,
  deleteAttachment
} = require('../controllers/taskController');
const { auth } = require('../middleware/auth');

// Configure multer for memory storage
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});

// All routes are protected
router.use(auth);

// Task routes
router.route('/')
  .post(createTask)
  .get(getTasks);

router.route('/:id')
  .get(getTaskById)
  .put(updateTask)
  .delete(deleteTask);

// Attachment routes
router.post('/:id/attachments', upload.single('file'), uploadAttachment);
router.delete('/:id/attachments/:attachmentId', deleteAttachment);

module.exports = router; 