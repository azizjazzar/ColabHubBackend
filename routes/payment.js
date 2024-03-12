
// Import dependencies
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser'); // Import body-parser
const paymentController = require('../controllers/paymentController');

// Use body-parser middleware to parse request bodies
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

// Route to create a PaymentIntent
router.post('/create-checkout-session', paymentController.createCheckoutSession);
router.post('/webhook', paymentController.stripeWebhook);

// Export the router
module.exports = router;
