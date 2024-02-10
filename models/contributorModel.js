const mongoose = require('mongoose');

const ContributorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  pricePerHour: {
    type: Number,
    required: true
  },
  experience: {
    type: String,
    required: true
  }
});

const Contributor = mongoose.model('Contributor', ContributorSchema);
module.exports = Contributor;
