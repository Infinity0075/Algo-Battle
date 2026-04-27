// 🔥 OPTIMIZED + stricter schema

const mongoose = require("mongoose");

const problemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true, // 🔧 added
      index: true, // 🔧 faster search
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
      index: true, // 🔧 useful for filtering
    },
    category: {
      type: String,
      trim: true,
      index: true, // 🔧 filtering
    },

    description: {
      type: String,
      required: true, // 🔧 enforced
    },

    examples: [
      {
        input: { type: String, required: true }, // 🔧 stricter
        output: { type: String, required: true }, // 🔧 stricter
      },
    ],

    constraints: [
      {
        type: String,
        trim: true,
      },
    ],

    starterCode: {
      javascript: { type: String, default: "" }, // 🔧 safe default
      cpp: { type: String, default: "" },
      python: { type: String, default: "" },
    },

    functionName: {
      type: String,
      default: "solution",
      trim: true,
    },

    slug: {
      type: String,
      unique: true,
      required: true, // 🔧 enforced
      index: true,
    },
    testCases: [
      {
        input: String,
        output: String,
      },
    ],
  },
  { timestamps: true },
);

// 🔧 ensure unique index properly
problemSchema.index({ slug: 1 }, { unique: true });

module.exports = mongoose.model("Problem", problemSchema);
