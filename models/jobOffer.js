  const mongoose = require("mongoose");

  const applicationSchema = new mongoose.Schema({
    applicantId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    cv: { type: String },
    applyDate: { type: Date, default: Date.now },
  });

  const jobOfferSchema = new mongoose.Schema({
    title: { type: String, required: true },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },

    freelancersId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false,
      },
    ],
    rate: { type: Number, required: false },
    expertiseLevel: { type: String, required: false },
    estimatedTime: { type: Number, required: false },
    duration: { type: Number, required: false }, // in hours
    budget: { type: Number, required: false },
    posted: { type: Date, default: Date.now },
    description: { type: String, required: false },
    technologies: [{ type: String }],
    //proposals: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Proposal' }],
    paymentVerified: { type: Boolean, default: false },
    amountSpent: { type: Number, default: 0 },
    location: {
      city: String,
      state: String,
      country: String,
    },

    applications: [applicationSchema],
  });

  const JobOffer = mongoose.model("JobOffer", jobOfferSchema);

  module.exports = JobOffer;
