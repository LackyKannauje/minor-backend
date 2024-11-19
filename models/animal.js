const mongoose = require("mongoose");
const { Schema } = mongoose;

const animalSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      required: true, // Represents the type of animal, e.g., dog, cat, etc.
    },
    caseType: {
      type: String,
      required: true,
      enum: ["adoption", "missing", "rescue"], // Specifies the purpose of the case
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    contact: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "rescued", "adopted", "found"],
      default: "pending",
      // required: true,
    },
    adminAction: {
      approvedBy: {
        type: Schema.Types.ObjectId,
        ref: "User", // References admin who approved the request
      },
    },
  },
  { timestamps: true }
);

const Animal = mongoose.model("Animal", animalSchema);

module.exports = Animal;
