const express = require('express');
const router = express.Router();
const contributionController = require('../controllers/ContributionController');

// Créer une nouvelle contribution
router.post('/', contributionController.createContribution);

// Récupérer toutes les contributions
router.get('/', contributionController.getAllContributions);

// Récupérer une contribution par son ID
router.get('/:contributionId', contributionController.getContributionById);

// Mettre à jour une contribution par son ID
router.put('/:contributionId', contributionController.updateContributionById);

// Supprimer une contribution par son ID
router.delete('/:contributionId', contributionController.deleteContributionById);

module.exports = router;
