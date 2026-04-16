const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    problemId: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["solved", "attempted"],
      default: "attempted",
    },

    language: {
      type: String,
      default: "javascript",
    },
  },
  {
    timestamps: true, // 🔥 IMPORTANT
  },
);

module.exports = mongoose.model("Submission", submissionSchema);
