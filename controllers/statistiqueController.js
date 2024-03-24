const Meeting = require('../models/Statistique');

// Ajouter une statistique

exports.getMeetingByTokenAndChannel = async (req, res) => {
  try {
    const { token, channel } = req.query; 
    const results = await Statistique.find({ token: token, channel: channel });
    res.json(results);
  } catch (err) {
    res.status(500).send({ message: "Erreur lors de la recherche des réunions", error: err.message });
  }
};


exports.addStatistique = async (req, res) => {
  try {
    const { clientA, clientB, dateEnrg, token, clientAID, clientBID, channel } = req.body;
    const nouvelleStatistique = new Meeting({
      clientA: clientA,
      clientB: clientB,
      clientAID: clientAID,
      clientBID: clientBID,
      dateEnrg: dateEnrg,
      channel: channel,
      token: token
    });
    const statistiqueEnregistree = await nouvelleStatistique.save();
    console.log('Statistique ajoutée avec succès :', statistiqueEnregistree);
    res.status(201).json(statistiqueEnregistree);
  } catch (error) {
    console.error('Erreur lors de l\'ajout de la statistique :', error);
    res.status(500).json({ error: 'Erreur lors de l\'ajout de la statistique' });
  }
};
exports.isClientAEmpty = async (req, res) => {
  const { token, channel } = req.body;
  try {
    const statistique = await Meeting.findOne({ token, channel });
    const isClientAEmpty = !statistique || !statistique.clientA;
    res.json(isClientAEmpty);
  } catch (error) {
    console.error('Error checking if clientA is empty:', error);
    res.status(500).json({ error: 'Error checking if clientA is empty' });
  }
};
// Obtenir toutes les statistiques
exports.getAllStatistiques = async (req, res) => {
  try {
    const statistiques = await Meeting.find();
    res.status(200).json(statistiques);
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques :', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des statistiques' });
  }
};

// Obtenir une statistique par ID
exports.getStatistiqueById = async (req, res) => {
  const { id } = req.params;
  try {
    const statistique = await Meeting.findById(id);
    if (!statistique) {
      return res.status(404).json({ error: 'Statistique non trouvée' });
    }
    res.status(200).json(statistique);
  } catch (error) {
    console.error('Erreur lors de la récupération de la statistique par ID :', error);
    res.status(500).json({ error: 'Erreur lors de la récupération de la statistique par ID' });
  }
};

// Mettre à jour une statistique par ID
exports.updateStatistiqueById = async (req, res) => {
  const { id } = req.params;
  const { clientA, clientB, dateEnrg, token, clientAID, clientBID, channel } = req.body;
  try {
    const statistique = await Meeting.findByIdAndUpdate(id, {
      clientA: clientA,
      clientB: clientB,
      clientAID: clientAID,
      clientBID: clientBID,
      dateEnrg: dateEnrg,
      channel: channel,
      token: token
    }, { new: true });
    if (!statistique) {
      return res.status(404).json({ error: 'Statistique non trouvée' });
    }
    console.log('Statistique mise à jour avec succès :', statistique);
    res.status(200).json(statistique);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la statistique :', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour de la statistique' });
  }
};

// Supprimer une statistique par ID
exports.deleteStatistiqueById = async (req, res) => {
  const { id } = req.params;
  try {
    const statistique = await Meeting.findByIdAndDelete(id);
    if (!statistique) {
      return res.status(404).json({ error: 'Statistique non trouvée' });
    }
    console.log('Statistique supprimée avec succès :', statistique);
    res.status(200).json(statistique);
  } catch (error) {
    console.error('Erreur lors de la suppression de la statistique :', error);
    res.status(500).json({ error: 'Erreur lors de la suppression de la statistique' });
  }
};
