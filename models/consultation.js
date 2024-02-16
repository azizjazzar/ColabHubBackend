const mongoose = require('mongoose');

const consultationSchema = new mongoose.Schema({
    titre: String,
    description: String,
    prixParMinute: Number,

    freelancerId:  {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false,
    },

    domaineExpertise: String,
    availabilityStart: {
        type: Date,
        default: null // Définir la valeur par défaut comme null
    },
    availabilityEnd: {
        type: Date,
        default: null // Définir la valeur par défaut comme null
    },
    statut: String,
    durée: Number
});

module.exports = mongoose.model('Consultation', consultationSchema);
