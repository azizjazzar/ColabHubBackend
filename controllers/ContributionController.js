const Contribution = require('../models/ContributionModel');

// Créer une nouvelle contribution
exports.createContribution = async (req, res) => {
  try {
    const newContribution = new Contribution(req.body);
    await newContribution.save();
    res.status(201).json(newContribution);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Récupérer toutes les contributions
exports.getAllContributions = async (req, res) => {
  try {
    const contributions = await Contribution.find();
    res.status(200).json(contributions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Récupérer une contribution par son ID
exports.getContributionById = async (req, res) => {
  try {
    const contribution = await Contribution.findById(req.params.contributionId);
    if (!contribution) {
      return res.status(404).json({ message: 'Contribution non trouvée' });
    }
    res.status(200).json(contribution);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mettre à jour une contribution par son ID
exports.updateContributionById = async (req, res) => {
  try {
    const contribution = await Contribution.findByIdAndUpdate(req.params.contributionId, req.body, { new: true });
    if (!contribution) {
      return res.status(404).json({ message: 'Contribution non trouvée' });
    }
    res.status(200).json(contribution);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Supprimer une contribution par son ID
exports.deleteContributionById = async (req, res) => {
  try {
    const contribution = await Contribution.findByIdAndDelete(req.params.contributionId);
    if (!contribution) {
      return res.status(404).json({ message: 'Contribution non trouvée' });
    }
    res.status(204).json();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
