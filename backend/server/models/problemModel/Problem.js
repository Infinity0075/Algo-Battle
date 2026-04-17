const mongoose = require("mongoose");

const problemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
    },
    category: String,

    description: String,

    examples: [
      {
        input: String,
        output: String,
      },
    ],

    constraints: [String],

    starterCode: {
      javascript: String,
      cpp: String,
    },
    slug: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Problem", problemSchema);
