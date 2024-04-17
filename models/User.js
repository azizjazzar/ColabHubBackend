const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  nom: {
    type: String,
  },
  prenom: {
    type: String,
  },
  email: {
    type: String,
  },
  genre: {
    type: String,
  },
  datenaissance: {
    type: String,
  },
  telephone: {
    type: String,
  },
  adresse: {
    type: String,
  },
   rate: {
    type: Number,
    default: 0, 
  },
  mot_passe: {
    type: String,
  },
  type: {
    type: String,
  },
  picture: {
    type: String, 
    contentType: String,
  },
});

UserSchema.pre('save', async function (next) {
  try {
    if (!this.id) {
      // Générez un identifiant unique si celui-ci n'est pas déjà défini
      const count = await mongoose.model('user').countDocuments();
      this.id = count + 1;
    }
    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model("user", UserSchema);
module.exports = User;
