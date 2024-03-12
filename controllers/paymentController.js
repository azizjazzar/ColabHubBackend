const stripe = require("stripe")(process.env.STRIPE_SECRET);

exports.createCheckoutSession = async (req, res) => {
    const { amount } = req.body;

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'Consultation',
                        },
                        unit_amount: amount * 100, // Montant en cents
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: 'http://localhost:5173/do-a-quick-consultation', // Ajouter une URL de redirection pour le succès
            cancel_url: 'http://localhost:3000/cancel',
        });

        res.json({  sessionId: session.id });
    } catch (error) {
        console.error('Erreur lors de la création de la session de paiement :', error);
        res.status(500).json({ success: false, error: error.message });
    }
};
exports.stripeWebhook = async (req, res) => {
    let event;

    try {
        // Verify the webhook signature
        const signature = req.headers['stripe-signature'];
        event = stripe.webhooks.constructEvent(req.rawBody, signature, process.env.STRIPE_ENDPOINT_SECRET);
    } catch (err) {
        console.error('Webhook signature verification failed.', err);
        return res.status(400).send('Webhook Error: Signature Verification Failed');
    }

    // Handle the event
    try {
        switch (event.type) {
            case 'checkout.session.completed':
                // Execute your code here after payment has been successful
                const sessionId = event.data.object.id;
                console.log(`Payment success for session ID: ${sessionId}`);
                // Perform actions after a successful payment
                break;
            default:
                console.log(`Unhandled event type: ${event.type}`);
        }
    } catch (error) {
        console.error('Error handling webhook event:', error.message);
        return res.status(400).send('Webhook Error: Failed to process event');
    }

    // Respond to the webhook
    res.json({ received: true });
};
