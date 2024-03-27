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
        maxlength: 10000, 

    },
    clientB: { 
        type: String,
        maxlength: 10000, 

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
});

const Statistique = mongoose.model("Statistique", MeetingSchema);
module.exports = Statistique;
