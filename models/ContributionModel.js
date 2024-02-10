const mongoose = require('mongoose');
const Contributor = require('./contributorModel');

const ContributionSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  contributors: [Contributor.schema] , 
  tasks:[{
              type: mongoose.Schema.Types.ObjectId,
              ref: 'Task',
        }]
  });


ContributionSchema.pre('save', async function (next) {
  try {
    if (!this.id) {
      // Générez un identifiant unique si celui-ci n'est pas déjà défini
      const count = await mongoose.model('Contribution').countDocuments();
      this.id = count + 1;
    }
    next();
  } catch (error) {
    next(error);
  }
});

const Contribution = mongoose.model('Contribution', ContributionSchema);
module.exports = Contribution;
