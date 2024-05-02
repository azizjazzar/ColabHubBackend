const mongoose = require("mongoose");

const MeetingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: false,
  },
  description: {  // Fix the typo here
    type: String,
    required: true,
  },
  suggestion: {  
    type: String,
  },
  dateStart: {
    type: Date,
    required: true,
  },
  dateEnd: {
    type: Date,
    required: true,
  },
  ownerId:  {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  freelancersId: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }],
});

const Meeting = mongoose.model("Meeting", MeetingSchema);
module.exports = Meeting;
