const mongoose = require("mongoose");

const ContributionSchema = new mongoose.Schema({
  name: {
    type: String,
  },



});

ContributionSchema.pre('save', async function (next) {
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

const Contribution = mongoose.model("contribution",ContributionSchema);
module.exports = Contribution;
