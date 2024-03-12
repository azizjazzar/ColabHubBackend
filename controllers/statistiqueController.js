const Meeting = require('../models/Statistique');

// Ajouter une statistique
exports.addStatistique = async (req, res) => {
  try {
    const { clientA, clientB, dateEnrg, token } = req.body;
    const nouvelleStatistique = new Meeting({
      clientA: clientA,
      clientB: clientB,
      dateEnrg: dateEnrg,
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
  const { clientA, clientB, dateEnrg, token } = req.body;
  try {
    const statistique = await Meeting.findByIdAndUpdate(id, {
      clientA: clientA,
      clientB: clientB,
      dateEnrg: dateEnrg,
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
