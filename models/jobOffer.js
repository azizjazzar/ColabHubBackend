const mongoose = require('mongoose');

const jobOfferSchema = new mongoose.Schema({
  title: { type: String, required: true },
  ownerId:  {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
},

  freelancersId: [ {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }],
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
// Dans le fichier jobOffer.js (ou où vous avez défini votre schéma et modèle)
jobOfferSchema.statics.getJobsForFreelancer = async function (freelancerId) {
  try {
    const jobs = await this.find({ freelancersId: freelancerId });
    return jobs;
  } catch (error) {
    console.error(`Erreur lors de la récupération des offres d'emploi : ${error.message}`);
    throw new Error('Erreur lors de la récupération des offres d\'emploi.');
  }
};
const JobOffer = mongoose.model('JobOffer', jobOfferSchema);

module.exports = JobOffer;
