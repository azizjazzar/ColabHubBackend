const mongoose = require("mongoose");

const MeetingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  desciption: {
    type: String,
    required: true,
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

  freelancersId: [ {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }],

  
});




const Meeting = mongoose.model("Meeting", MeetingSchema);
module.exports = Meeting;
