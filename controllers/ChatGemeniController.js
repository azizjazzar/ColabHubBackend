const ChatGemeni = require('../models/ChatGemeni');

exports.saveResponse = async (req, res) => {
    try {
        const { role, message,userId } = req.body;
        const response = await ChatGemeni.create({
            role: role,
            message: message,
            userId: userId
        });

        res.status(201).json(response);
    } catch (error) {
        console.error("Erreur lors de l'enregistrement de la réponse :", error);
        res.status(500).json({ message: "Une erreur s'est produite lors de l'enregistrement de la réponse." });
    }
};
