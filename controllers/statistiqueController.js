const Meeting = require('../models/Statistique');

exports.addStatistique = async (req, res) => {
  try {
    // Extraire les données de la requête
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
