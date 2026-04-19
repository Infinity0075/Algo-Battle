// 🔥 OPTIMIZED + indexed + production safe

const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // 🔧 faster queries
    },

    problem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem",
      required: true,
      index: true, // 🔧 important for stats/status
    },

    status: {
      type: String,
      enum: ["solved", "attempted"],
      default: "attempted",
      index: true, // 🔧 filtering
    },

    language: {
      type: String,
      default: "javascript",
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

// 🔧 compound index (major performance boost)
submissionSchema.index({ user: 1, problem: 1 });
submissionSchema.index({ user: 1, status: 1 });

module.exports = mongoose.model("Submission", submissionSchema);
