const mongoose = require('mongoose');

const clientRequestSchema = new mongoose.Schema({
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  instructions: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('ClientRequest', clientRequestSchema);
