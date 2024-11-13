const mongoose = require("mongoose");

const animalSchema = new mongoose.Schema({
  category: { type: String, required: true },
  description: { type: String, required: true },
  status: {
    type: String,
    required: true,
    enum: ["adopted", "available for adoption", "needs rescue", "missing"],
  },
  location: { type: String, required: false },
  contact: { type: String, required: false },
  image: { type: String, required: false },
});

const Animal = mongoose.model("Animal", animalSchema);

module.exports = Animal;
