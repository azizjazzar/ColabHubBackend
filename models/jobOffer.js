const mongoose = require('mongoose');

const jobOfferSchema = new mongoose.Schema({
  title: { type: String, required: true },
  rate: { type: Number, required: true },
  expertiseLevel: { type: String, required: true },
  estimatedTime: { type: Number, required: true },
  duration: { type: Number, required: true }, // in hours
  budget: { type: Number, required: true },
  posted: { type: Date, default: Date.now },
  description: { type: String, required: true },
  technologies: [{ type: String }],
  //proposals: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Proposal' }],
  paymentVerified: { type: Boolean, default: false },
  amountSpent: { type: Number, default: 0 },
  location: {
    city: String,
    state: String,
    country: String
  }
});

const JobOffer = mongoose.model('JobOffer', jobOfferSchema);

module.exports = JobOffer;
