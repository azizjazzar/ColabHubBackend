const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  applicantId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  cv: { type: String },
  applyDate: { type: Date, default: Date.now },
});

const jobOfferSchema = new mongoose.Schema({
  title: { type: String, required: true },
  expertiseLevel: { type: String, required: true },
  estimatedTime: { type: Number, required: true },
  duration: { type: Number, required: true }, // in hours
  budget: { type: Number, required: true },
  posted: { type: Date, default: Date.now },
  description: { type: String, required: true },
  technologies: [{ type: String, required: true }],
  paymentVerified: { type: Boolean, default: false },
  amountSpent: { type: Number, default: 0 },
  location: {
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
  },
  applications: [applicationSchema], // Linking applications to job offers
});

const JobOffer = mongoose.model("JobOffer", jobOfferSchema);
module.exports = JobOffer;
