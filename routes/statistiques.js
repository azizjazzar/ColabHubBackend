const express = require('express');
const router = express.Router();
const MeetingController = require('../controllers/statistiqueController');

// Ajouter une statistique
router.post('/stats/add', MeetingController.addStatistique);
router.get('/stats', MeetingController.getAllStatistiques);
router.get('/stats-counts', MeetingController.getCountOfStatistiques);

// Obtenir une statistique par ID
router.get('/stats/:id', MeetingController.getStatistiqueById);
router.post('/meeting-token-channel', MeetingController.getMeetingByTokenAndChannel);

// Mettre à jour une statistique par ID
router.put('/stats/:id', MeetingController.updateStatistiqueById);
router.post('/stats/check-client-a', MeetingController.isClientAEmpty);
// Supprimer une statistique par ID
router.delete('/stats/:id', MeetingController.deleteStatistiqueById);

module.exports = router;
