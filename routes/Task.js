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

// Route pour lire les tâches par ID de projet
router.get('/project/:projectId', taskController.getTasksByProjectId);


//cherche task par freelancer 
router.get('get/freelancer/:taskId', taskController.getTasksByFreelancerId);


module.exports = router;
