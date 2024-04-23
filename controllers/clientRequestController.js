const ClientRequest = require('../models/ClientRequest');

exports.saveClientRequest = async (req, res) => {
  try {
    const { serviceId, userId, email, instructions } = req.body;

    // Créez une nouvelle demande client
    const clientRequest = new ClientRequest({
      serviceId,
      userId,
      email,
      instructions,
    });

    // Enregistrez la demande client dans la base de données
    await clientRequest.save();

    res.status(201).json({ message: 'Client request saved successfully' });
  } catch (error) {
    console.error('Error saving client request:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


// Contrôleur pour récupérer le nombre total de demandes pour un service spécifique
exports.getTotalRequestsByServiceId = async (req, res) => {
  try {
    const serviceId = req.params.serviceId;

    // Effectuez une requête à MongoDB pour compter le nombre de demandes pour ce serviceId
    const totalRequests = await ClientRequest.countDocuments({ serviceId });

    res.status(200).json({ totalRequests });
  } catch (error) {
    console.error('Error fetching total requests:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
