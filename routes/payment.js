// Importer les dépendances nécessaires
const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');


// Route pour créer un PaymentIntent
router.post('/create-checkout-session', paymentController.createCheckoutSession);
router.post('/webhook',paymentController.stripeWebhook );

// Exporter le routeur
module.exports = router;
