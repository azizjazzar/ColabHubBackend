// jobOfferController.js
const JobOffer = require('../models/jobOffer')

// Controller to create a new job offer
exports.createJobOffer = async (req, res) => {
  try {
    const jobOffer = new JobOffer(req.body);
    await jobOffer.save();
    res.status(201).json(jobOffer);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Controller to get all job offers
exports.getAllJobOffers = async (req, res) => {
  try {
    const jobOffers = await JobOffer.find();
    res.status(200).json(jobOffers);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Controller to get a single job offer by ID
exports.getJobOfferById = async (req, res) => {
  try {
    const jobOffer = await JobOffer.findById(req.params.jobId);
    if (!jobOffer) {
      return res.status(404).json({ error: 'Job Offer not found' });
    }
    res.status(200).json(jobOffer);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Controller to update a job offer by ID
exports.updateJobOffer = async (req, res) => {
  try {
    const jobOffer = await JobOffer.findByIdAndUpdate(
      req.params.jobId,
      req.body,
      { new: true }
    );
    if (!jobOffer) {
      return res.status(404).json({ error: 'Job Offer not found' });
    }
    res.status(200).json(jobOffer);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Controller to delete a job offer by ID
exports.deleteJobOffer = async (req, res) => {
  try {
    const jobOffer = await JobOffer.findByIdAndDelete(req.params.jobId);
    if (!jobOffer) {
      return res.status(404).json({ error: 'Job Offer not found' });
    }
    res.status(204).send(); // No content on successful deletion
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
// Fonction pour lire les tâches par ID de  user 
exports.getJobByProjectId = async (req, res, next) => {
  try {
    const userId = req.params.userId;

    // Vérifiez si l'ID du user est fourni dans la requête
    if (!userId) {
      return res.status(400).json({ error: 'user non fourni' });
    }

    // Requête pour trouver les tâches liées à l'ID du user
    const job = await jobOffer.find({ userId });

    res.status(200).json(job);
  } catch (error) {
    console.error('Erreur lors de la récupération des tâches par ID de user :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};
