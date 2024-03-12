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

        res.json({ sessionId: session.id });
    } catch (error) {
        console.error('Erreur lors de la création de la session de paiement :', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.stripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;

    try {
        const event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
        console.log('Webhook event:', event);

        // Gérer l'événement
        switch (event.type) {
            case 'payment_intent.requires_action':
                // Définir et appeler une fonction pour gérer l'événement payment_intent.requires_action
                break;
            case 'payment_intent.succeeded':
                const paymentIntentSucceeded = event.data.object;
                console.log('Paiement réussi:', paymentIntentSucceeded);
                // Faites ce que vous avez à faire après un paiement réussi
                break;
            // Gérer les autres types d'événements
            default:
                console.log(`Type d'événement non géré ${event.type}`);
        }

        // Répondre au webhook avec un statut 200 pour indiquer que l'événement a été reçu avec succès
        res.status(200).end();
    } catch (err) {
        console.error('Erreur lors de la vérification de la signature du webhook :', err);
        res.status(400).send(`Erreur du webhook : ${err.message}`);
    }
};
