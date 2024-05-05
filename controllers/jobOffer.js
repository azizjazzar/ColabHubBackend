// jobOfferController.js
const JobOffer = require("../models/jobOffer");

// Controller to create a new job offer
exports.createJobOffer = async (req, res) => {
  try {
    const jobOffer = new JobOffer(req.body);
    await jobOffer.save();
    res.status(201).json(jobOffer);
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

exports.applyToJobOffer = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const userId = req.user._id; 
    if (!req.file) {
      return res
        .status(400)
        .json({
          error: "No PDF file uploaded or file format is not supported",
        });
    }
    const cvPath = req.file.path; 

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
};


exports.getJobOfferById = async (req, res) => {
  try {
    const jobOffer = await JobOffer.findById(req.params.jobId).populate({
      path: "applications",
      select: "applicantId cv applyDate", // Select specific fields to return
      populate: {
        path: "applicantId",
        select: "name email", // Assuming these fields are available in the User model
      },
    });

    if (!jobOffer) {
      return res.status(404).json({ error: "Job Offer not found" });
    }

    res.status(200).json(jobOffer);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};


