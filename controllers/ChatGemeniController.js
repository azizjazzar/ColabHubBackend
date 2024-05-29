const ChatGemeni = require('../models/ChatGemeni');

exports.saveResponse = async (req, res) => {
    try {
        const { role, message, userId } = req.body;
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

exports.getAllResponses = async (req, res) => {
    try {
        const allResponses = await ChatGemeni.find();
        res.status(200).json(allResponses);
    } catch (error) {
        console.error("Erreur lors de la récupération de toutes les réponses :", error);
        res.status(500).json({ message: "Une erreur s'est produite lors de la récupération de toutes les réponses." });
    }
};
exports.getResponseById = async (req, res) => {
    try {
        const responseId = req.params.id;
        const response = await ChatGemeni.findById(responseId);
        if (!response) {
            return res.status(404).json({ message: "Réponse non trouvée" });
        }
        res.status(200).json(response);
    } catch (error) {
        console.error("Erreur lors de la récupération de la réponse par ID :", error);
        res.status(500).json({ message: "Une erreur s'est produite lors de la récupération de la réponse par ID." });
    }
};
exports.getAllResponsesById = async (req, res) => {
    try {
        const responseId = req.params.id;
        const responses = await ChatGemeni.find({ _id: responseId });
        if (!responses || responses.length === 0) {
            return res.status(404).json({ message: "Aucune réponse trouvée pour cet ID" });
        }
        res.status(200).json(responses);
    } catch (error) {
        console.error("Erreur lors de la récupération des réponses par ID :", error);
        res.status(500).json({ message: "Une erreur s'est produite lors de la récupération des réponses par ID." });
    }
};

exports.geminiWithText = async (req, res) => {
    const { text } = req.body;
  
    try {
      const googleGeminiURL =
        "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent";
  
      const requestBody = {
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `${text}`,
              },
            ],
          },
        ],
      };
  
      const response = await axios.post(googleGeminiURL, requestBody, {
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINIKEY,
        },
      });
  
      // Récupérer le texte généré à partir de la réponse
      const generatedText = response.data.candidates[0].content.parts[0].text;
  
      // Envoyer le texte généré en réponse
      res.json({ answer: generatedText });
    } catch (error) {
      // Gérer les erreurs ici
      console.error("Erreur lors de la requête à Google Gemini:", error);
      res.status(500).json({
        message: "Une erreur s'est produite lors de la requête à Google Gemini",
      });
    }
  };