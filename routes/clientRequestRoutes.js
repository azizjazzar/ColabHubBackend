const express = require('express');
const router = express.Router();
const clientRequestController = require('../controllers/clientRequestController');

// Endpoint pour enregistrer une demande client
router.post('/saveClientRequest', clientRequestController.saveClientRequest);
router.get('/total/:serviceId', clientRequestController.getTotalRequestsByServiceId);

module.exports = router;
