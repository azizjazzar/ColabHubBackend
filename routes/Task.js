const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

// Create a new task
router.post('/tasks', taskController.createTask);

// Get all tasks
router.get('/tasks', taskController.getAllTasks);

// Get a task by ID
router.get('/tasks/:taskId', taskController.getTaskById);

// Update a task by ID
router.put('/tasks/:taskId', taskController.updateTaskById);

// Delete a task by ID
router.delete('/tasks/:taskId', taskController.deleteTaskById);

module.exports = router;
