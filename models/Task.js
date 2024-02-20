const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
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

  
});

TaskSchema.pre("save", async function (next) {
  try {
    if (!this.id) {
      // Générez un identifiant unique si celui-ci n'est pas déjà défini
      const count = await mongoose.model("Task").countDocuments();
      this.id = count + 1;
    }
    next();
  } catch (error) {
    next(error);
  }
});

const Task = mongoose.model("Task", TaskSchema);
module.exports = Task;
