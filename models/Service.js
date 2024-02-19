const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    freelancerId:  {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    
    deliveryTime: Number,
    domaineExpertise: {
        type: String,
        enum: ['Web Development', 'Mobile App Development', 'Logo Design', 'Graphic Design', 'Video & Audio', 'Writing & Translation', 'Digital Marketing', 'Virtual Assistant', 'Photography & Image Editing', 'Video Production & Editing', 'Audio Production & Editing', 'Music Production & Editing', 'Data Science', 'Blockchain, NFT & Cryptocurrency', 'Animation for Streamers', 'Other']
    },
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
