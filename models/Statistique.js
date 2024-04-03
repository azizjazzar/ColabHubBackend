const mongoose = require("mongoose");

const MeetingSchema = new mongoose.Schema({
    clientAID: {
        type: String,
    },
    clientBID: { 
        type: String,
    },
    clientA: {
        type: String,
    },
    clientB: { 
        type: String,
    },
    responseClientA:{
        type: String,
    },
    responseClientB:{
        type: String,
    },
    dateEnrg: {
        type: Date,
        default: Date.now 
    },
    token: {
        type: String,
    },
    channel: {
        type: String,
    },
    // Ajout du champ Status
    status: {
        type: String,
    },
});

const Statistique = mongoose.model("Statistique", MeetingSchema);
module.exports = Statistique;
