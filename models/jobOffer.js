const mongoose = require('mongoose');

const jobOfferSchema = new mongoose.Schema({
  title: { type: String, required: false },
  expertiseLevel: { type: String, required: false },
  estimatedTime: { type: Number, required: false },
  duration: { type: Number, required: false }, // in hours
  budget: { type: Number, required: false },
  posted: { type: Date, default: Date.now },
  description: { type: String, required: false },
  technologies: [{ type: String }],
  paymentVerified: { type: Boolean, default: false },
  amountSpent: { type: Number, default: 0 },
  location: {
    city: String,
    state: String,
    country: String,
  },
});

const JobOffer = mongoose.model('JobOffer', jobOfferSchema);

module.exports = JobOffer;
