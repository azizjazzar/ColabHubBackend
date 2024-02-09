const express = require('express');
const router = express.Router();
const contributionController = require('../controllers/contributionController');

// Create a new contribution
router.post('/contributions', contributionController.createContribution);

// Get all contributions
router.get('/contributions', contributionController.getAllContributions);

// Get a contribution by ID
router.get('/contributions/:contributionId', contributionController.getContributionById);

// Update a contribution by ID
router.put('/contributions/:contributionId', contributionController.updateContributionById);

// Delete a contribution by ID
router.delete('/contributions/:contributionId', contributionController.deleteContributionById);

module.exports = router;
