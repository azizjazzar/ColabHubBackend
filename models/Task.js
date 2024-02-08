const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({

    name: {
        type: Date,
      },
  dateStart: {
    type: Date,
  },
  dateEnd: {
    type: Date,
  },
  Contribution: {
    type: Contribution,
  },



});

UserSchema.pre('save', async function (next) {
  try {
    if (!this.id) {
      // Générez un identifiant unique si celui-ci n'est pas déjà défini
      const count = await mongoose.model('contribution').countDocuments();
      this.id = count + 1;
    }
    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model("contribution",ContributionSchema);
module.exports = Contribution;
