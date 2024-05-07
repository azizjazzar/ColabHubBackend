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
      return res.status(404).json({ error: "Job Offer not found" });
    }
    let users = [];
    // Iterate through the array of freelancers
    for (const freelancerId of jobOffer.freelancersId) {
      const user = await User.findById(freelancerId);
      if (user) {
        users.push(user);
      }
    }
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getJobsForFreelancer = async (req, res) => {
  try {
    const freelancerId = req.params.freelancerId;
    if (!freelancerId) {
      return res.status(400).json({ error: "Freelancer ID not provided" });
    }
    const jobs = await JobOffer.find({ freelancersId: freelancerId }).exec();
    res.status(200).json(jobs);
  } catch (error) {
    console.error("Error retrieving jobs by freelancer ID:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

// Controller to add a freelancer to a job offer by ID
exports.addFreelancerToJobOffer = async (req, res) => {
  try {
    const { jobId, freelancerId } = req.body;
    if (!jobId || !freelancerId) {
      return res
        .status(400)
        .json({ error: "JobOffer ID or freelancer ID not provided" });
    }
    const jobOffer = await JobOffer.findById(jobId);
    if (!jobOffer) {
      return res.status(404).json({ error: "Job Offer not found" });
    }
    jobOffer.freelancersId.push(freelancerId);
    await jobOffer.save();
    res.status(200).json(jobOffer);
  } catch (error) {
    console.error("Error adding freelancer to job offer:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

exports.applyToJobOffer = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const userId = req.body.userId; // Assuming you're getting the user's ID from session or token
    if (!req.file) {
      return res.status(400).json({
        error: "No PDF file uploaded or file format is not supported",
      });
    }
    const cvPath = req.file.path; // Path where the CV is stored

    const application = {
      applicantId: userId,
      cv: cvPath,
    };

    const jobOffer = await JobOffer.findByIdAndUpdate(
      jobId,
      { $push: { applications: application } },
      { new: true }
    );

    if (!jobOffer) {
      return res.status(404).json({ error: "Job Offer not found" });
    }

    res.status(201).json({ message: "Application successful", application });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }

  // Properly renamed to reflect its functionality and fix the typo
};

exports.getJobOfferApplicationById = async (req, res) => {
  try {
   const jobOffer = await JobOffer.findById(req.params.jobId).populate({
     path: "applications",
     select: "applicantId cv applyDate",
     populate: {
       path: "applicantId",
       model: "user",
       select: "nom prenom email", // Adjust according to actual schema fields
     },
   });
    if (!jobOffer) {
      return res.status(404).json({ error: "Job Offer not found" });
    }

    res.status(200).json(jobOffer);
  } catch (error) {
    console.error("Error fetching job offer with applications:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
