const Contributor = require('../models/contributorModel');

// Créer un nouveau contributeur
exports.createContributor = async (req, res) => {
  try {
    const newContributor = new Contributor(req.body);
    await newContributor.save();
    res.status(201).json(newContributor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Récupérer tous les contributeurs
exports.getAllContributors = async (req, res) => {
  try {
    const contributors = await Contributor.find();
    res.status(200).json(contributors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Récupérer un contributeur par son ID
exports.getContributorById = async (req, res) => {
  try {
    const contributor = await Contributor.findById(req.params.contributorId);
    if (!contributor) {
      return res.status(404).json({ message: 'Contributeur non trouvé' });
    }
    res.status(200).json(contributor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mettre à jour un contributeur par son ID
exports.updateContributorById = async (req, res) => {
  try {
    const contributor = await Contributor.findByIdAndUpdate(req.params.contributorId, req.body, { new: true });
    if (!contributor) {
      return res.status(404).json({ message: 'Contributeur non trouvé' });
    }
    res.status(200).json(contributor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Supprimer un contributeur par son ID
exports.deleteContributorById = async (req, res) => {
  try {
    const contributor = await Contributor.findByIdAndDelete(req.params.contributorId);
    if (!contributor) {
      return res.status(404).json({ message: 'Contributeur non trouvé' });
    }
    res.status(204).json();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
