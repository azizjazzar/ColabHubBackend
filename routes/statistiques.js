const express = require('express');
const router = express.Router();
const MeetingController = require('../controllers/statistiqueController');

// Ajouter une statistique
router.post('/stats/add', MeetingController.addStatistique);

// Obtenir toutes les statistiques
router.get('/stats', MeetingController.getAllStatistiques);

// Obtenir une statistique par ID
router.get('/stats/:id', MeetingController.getStatistiqueById);

// Mettre à jour une statistique par ID
router.put('/stats/:id', MeetingController.updateStatistiqueById);
router.get('/stats/check-client-a', MeetingController.isClientAEmpty);
// Supprimer une statistique par ID
router.delete('/stats/:id', MeetingController.deleteStatistiqueById);

module.exports = router;
