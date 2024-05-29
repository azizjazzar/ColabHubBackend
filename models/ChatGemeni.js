const mongoose = require("mongoose");

const ChatGemeni = mongoose.Schema(
  {
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false,
      },    role: { type: String, trim: true },
    message: { type: String, default: false, maxlength: 1000 },
    sendat: { type: Date, default: Date.now } 
  },
  { timestamps: true }
);

const Chat_Gemeni = mongoose.model("ChatGemeni", ChatGemeni);

module.exports = Chat_Gemeni;
