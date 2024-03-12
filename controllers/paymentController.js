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
        // Vérifiez la signature du webhook
        const signature = req.headers['stripe-signature'];
        event = stripe.webhooks.constructEvent(req.rawBody, signature, process.env.STRIPE_ENDPOINT_SECRET);
    } catch (err) {
        console.error('Webhook signature verification failed.', err);
        return res.sendStatus(400);
    }

    // Gérez l'événement
    if (event.type === 'checkout.session.completed') {
        // Exécutez votre code ici après que le paiement a été effectué
        const sessionId = event.data.object.id;
        console.log(`Payment success for session ID: ${sessionId}`);
        // Faites ce que vous avez à faire après un paiement réussi
    }

    // Répondez au webhook
    res.json({ received: true });
};
