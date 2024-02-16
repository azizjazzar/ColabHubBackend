const express = require('express');
const router = express.Router();
const projectsController = require('../controllers/projectsController');

router.post('/', projectsController.createProject);
router.get('/', projectsController.getAllProjects);
router.get('/:id', projectsController.getProjectById);
router.put('/:id', projectsController.updateProject);
router.delete('/:id', projectsController.deleteProject);
router.post('/purchase/:id', projectsController.purchaseProject);

module.exports = router;

