const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    freelancerId:  {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    
    expertiseDomain: String,
    title: String,
    description: String,
    pricing: {
        starter: Number,
        standard: Number,
        advanced: Number
    },
    images: [String]
});

module.exports = mongoose.model('Service', serviceSchema);