const express = require('express');
const router = express.Router();
const taskController = require('../controllers/TaskController');

// Create a new task
router.post('/', taskController.createTask);

// Get all tasks
router.get('/', taskController.getAllTasks);

// Get a task by ID
router.get('/:taskId', taskController.getTaskById);

// Update a task by ID
router.put('/:taskId', taskController.updateTaskById);

// Delete a task by ID
router.delete('/:taskId', taskController.deleteTaskById);

module.exports = router;
