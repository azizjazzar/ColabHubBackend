const express = require('express');
const router = express.Router();
const consultationsController = require('../controllers/consultationsController');

router.post('/addConsultation', consultationsController.createConsultation);
router.get('/consultations', consultationsController.getAllConsultations);
router.get('/:id', consultationsController.getConsultationById);
router.put('/:id', consultationsController.updateConsultation);
router.delete('/:id', consultationsController.deleteConsultation);
router.post('/reserver/:id', consultationsController.reserveConsultation);

module.exports = router;
