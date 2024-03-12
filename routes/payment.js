// Import dependencies
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser'); // Import body-parser
const paymentController = require('../controllers/paymentController');

// Route to create a PaymentIntent
router.post('/create-checkout-session', paymentController.createCheckoutSession);

// Route to handle Stripe webhook
router.post('/webhook', bodyParser.raw({ type: 'application/json' }), paymentController.stripeWebhook);

// Export the router
module.exports = router;
