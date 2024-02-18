
const stripe =require("stripe")(process.env.STRIPE_SECRET);


// Créer une session de paiement avec Stripe
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
                        unit_amount: amount,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: 'http://localhost:3000/success', // URL à rediriger après un paiement réussi
            cancel_url: 'http://localhost:3000/cancel', // URL à rediriger après l'annulation du paiement
        });

        res.json({ sessionId: session.id });
    } catch (error) {
        console.error('Erreur lors de la création de la session de paiement :', error);
        res.status(500).json({ success: false, error: error.message });
    }
};
