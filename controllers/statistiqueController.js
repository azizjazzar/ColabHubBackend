const Meeting = require('../models/Statistique');
const User = require('../models/User'); 

// Ajouter une statistique
exports.addStatistique = async (req, res) => {
  try {
    const { clientA, clientB, dateEnrg, token, clientAID, clientBID, channel, responseClientA, responseClientB, status } = req.body;
    const nouvelleStatistique = new Meeting({
      clientA,
      clientB,
      clientAID,
      clientBID,
      dateEnrg,
      token,
      channel,
      responseClientA,
      responseClientB,
      status // Ajout du champ status
    });
    const statistiqueEnregistree = await nouvelleStatistique.save();
    console.log('Statistique ajoutée avec succès :', statistiqueEnregistree);
    res.status(201).json(statistiqueEnregistree);
  } catch (error) {
    console.error('Erreur lors de l\'ajout de la statistique :', error);
    res.status(500).json({ error: 'Erreur lors de l\'ajout de la statistique' });
  }
};

// Mettre à jour une statistique par ID
exports.updateStatistiqueById = async (req, res) => {
  const { id } = req.params;
  const { clientA, clientB, dateEnrg, token, clientAID, clientBID, channel, responseClientA, responseClientB, status } = req.body;
  try {
    const statistique = await Meeting.findByIdAndUpdate(id, {
      clientA,
      clientB,
      clientAID,
      clientBID,
      dateEnrg,
      token,
      channel,
      responseClientA,
      responseClientB,
      status // Ajout du champ status
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

exports.getall = async (req, res) => {
  try {
    // Retrieve all meetings
    const statistiques = await Meeting.find();

    // Map through each meeting and perform database lookup for clientA and clientB information
    const statistiquesWithUserInfo = await Promise.all(statistiques.map(async (statistique) => {
      const { clientAID, clientBID } = statistique;

      // Find user information for clientA
      const userA = await User.findOne({ _id: clientAID });
      // Find user information for clientB
      const userB = await User.findOne({ _id: clientBID });

      // Construct an object containing required information
      return {
        ...statistique.toObject(), // Convert Mongoose document to plain JavaScript object
        clientA: userA ? { nom: userA.nom, prenom: userA.prenom, picture: userA.picture } : null,
        clientB: userB ? { nom: userB.nom, prenom: userB.prenom, picture: userB.picture } : null
      };
    }));

    // Send response with the enriched statistics
    res.status(200).json(statistiquesWithUserInfo);
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques :', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des statistiques' });
  }
};

exports.getMeetingByTokenAndChannel = async (req, res) => {
  try {
    const { c, t } = req.body; 
    const results = await Meeting.findOne({ channel: c, token: t });
    res.json("hello");
  } catch (err) {
    res.status(500).send({ message: "Erreur lors de la recherche des réunions", error: err.message });
  }
};
exports.getCountOfStatistiques = async (req, res) => {
  try {
    // Compter le nombre total de documents dans la collection
    const count = await Meeting.countDocuments();

    // Renvoyer le nombre total en tant que réponse JSON
    res.status(200).json({ count });
  } catch (error) {
    console.error('Erreur lors de la récupération du nombre de statistiques :', error);
    res.status(500).json({ error: 'Erreur lors de la récupération du nombre de statistiques' });
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
