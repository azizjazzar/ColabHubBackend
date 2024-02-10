const express = require('express');
const router = express.Router();
const contributorController = require('../controllers/contributorController');

// Créer un nouveau contributeur
router.post('/', contributorController.createContributor);

// Récupérer tous les contributeurs
router.get('/', contributorController.getAllContributors);

// Récupérer un contributeur par son ID
router.get('/:contributorId', contributorController.getContributorById);

// Mettre à jour un contributeur par son ID
router.put('/:contributorId', contributorController.updateContributorById);

// Supprimer un contributeur par son ID
router.delete('/:contributorId', contributorController.deleteContributorById);

module.exports = router;
