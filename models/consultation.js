const mongoose = require('mongoose');

const consultationSchema = new mongoose.Schema({
    titre: String,
    description: String,
    prixParMinute: Number,

    freelancerId:  {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    domaineExpertise: String,
    disponibilités: [Date],
    statut: String,
    durée: Number
});

module.exports = mongoose.model('Consultation', consultationSchema);

