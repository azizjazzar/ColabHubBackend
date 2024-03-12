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
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
        console.error('Webhook signature verification failed.', err);
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }

    // Handle the event
    switch (event.type) {
        case 'payment_intent.requires_action':
            const paymentIntentRequiresAction = event.data.object;
            // Define and call a function to handle the event payment_intent.requires_action
            break;
        case 'payment_intent.succeeded':
            const paymentIntentSucceeded = event.data.object;
            console.log('Payment intent succeeded:', paymentIntentSucceeded);
            // Log any information you need when a payment intent succeeds
            break;
        // Handle other event types
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    res.send();
};

