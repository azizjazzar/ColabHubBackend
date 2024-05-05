// jobOfferController.js
const JobOffer = require("../models/jobOffer");
const User = require("../models/User");




// Controller to create a new job offer
exports.createJobOffer = async (req, res) => {
try {
  const joboffer = new JobOffer(req.body);
  await joboffer.save();
  res.status(201).json(joboffer);
} catch (error) {
  res.status(500).json({ error: "Internal Server Error" });
}

};


// Controller to get all job offers
exports.getAllJobOffers = async (req, res) => {
  try {
    
    const jobOffers = await JobOffer.find();
    res.status(200).json(jobOffers);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Controller to get a single job offer by ID
exports.getJobOfferById = async (req, res) => {
  try {
    const jobOffer = await JobOffer.findById(req.params.jobId);
    if (!jobOffer) {
      return res.status(404).json({ error: "Job Offer not found" });
    }
    res.status(200).json(jobOffer);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
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
      return res.status(404).json({ error: "Job Offer not found" });
    }
    res.status(200).json(jobOffer);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Controller to delete a job offer by ID
exports.deleteJobOffer = async (req, res) => {
  try {
    const jobOffer = await JobOffer.findByIdAndDelete(req.params.jobId);
    if (!jobOffer) {
      return res.status(404).json({ error: "Job Offer not found" });
    }
    res.status(204).send(); // No content on successful deletion
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getAllFreelancerByJob = async (req, res) => {
  try {
    const jobOffer = await JobOffer.findById(req.params.jobId);
    if (!jobOffer) {
      return res.status(404).json({ error: 'Job Offer not found' });
    }
    let users= [];
       // Itérer à travers le tableau de freelancers
       for (const freelancerId of jobOffer.freelancersId) {
       const  user = await User.findById(freelancerId);
        if (user) {
          users.push(user);
        }
      }
      
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



// Contrôleur pour récupérer tous les emplois affectés à un freelancer par son ID
exports.getJobsForFreelancer = async (req, res) => {
  try {
    const freelancerId = req.params.freelancerId;

    // Vérifiez si l'ID du freelancer est fourni dans la requête
    if (!freelancerId) {
      return res.status(400).json({ error: 'ID de freelancer non fourni' });
    }

    // Requête pour trouver les offres d'emploi liées à l'ID du freelancer
    const jobs = await JobOffer.find({ freelancersId: freelancerId }).exec();

    res.status(200).json(jobs);
  } catch (error) {
    console.error('Erreur lors de la récupération des offres d\'emploi par ID de freelancer :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};


// Controller to add a freelancer to a job offer by ID
exports.addFreelancerToJobOffer = async (req, res) => {
  try {
    const { jobId, freelancerId } = req.body;

    // Vérifiez si les identifiants du jobOffer et du freelancer sont fournis dans la requête
    if (!jobId || !freelancerId) {
      return res.status(400).json({ error: 'ID du jobOffer ou ID du freelancer non fourni' });
    }

    // Recherchez le jobOffer par son ID
    const jobOffer = await JobOffer.findById(jobId);

    // Vérifiez si le jobOffer existe
    if (!jobOffer) {
      return res.status(404).json({ error: 'Job Offer non trouvé' });
    }

    // Ajoutez le freelancerId au tableau freelancersId du jobOffer
    jobOffer.freelancersId.push(freelancerId);

    // Enregistrez les modifications du jobOffer
    await jobOffer.save();

    res.status(200).json(jobOffer);
  } catch (error) {
    console.error('Erreur lors de l\'ajout du freelancer au jobOffer :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

