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
  dateEnrg: {
    type: Date,
  },
  token: {
    type: String,
  } , 
});

const stats = mongoose.model("Statistique", MeetingSchema);
module.exports = stats;
