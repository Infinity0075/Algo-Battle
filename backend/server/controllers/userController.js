/**
 * ============================================
 * 👤 USER CONTROLLER
 * ============================================
 *
 * 📌 Responsibilities:
 * 1. Leaderboard (top users)
 * 2. User profile (stats + recent)
 *
 * 📌 Flow:
 * Route → Controller → DB (aggregate/find) → Response
 */

const Submission = require("../models/Submission");
const User = require("../models/User");

/**
 * ============================================
 * 🏆 LEADERBOARD
 * ============================================
 *
 * Logic:
 * - Count unique solved problems per user
 * - Sort by solved count, then rating
 */
const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await Submission.aggregate([
      /** 🔹 STEP 1: only solved */
      { $match: { status: "solved" } },

      /** 🔹 STEP 2: group by user */
      {
        $group: {
          _id: "$user",
          solvedProblems: { $addToSet: "$problem" }, // unique problems
        },
      },

      /** 🔹 STEP 3: count solved */
      {
        $project: {
          solved: { $size: "$solvedProblems" },
        },
      },

      /** 🔹 STEP 4: join user */
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },

      { $unwind: "$user" },

      /** 🔹 STEP 5: format */
      {
        $project: {
          username: "$user.username",
          rating: "$user.rating",
          solved: 1,
        },
      },

      /** 🔹 STEP 6: sort */
      { $sort: { solved: -1, rating: -1 } },

      { $limit: 50 },
    ]);

    res.json(leaderboard);
  } catch (err) {
    console.error("LEADERBOARD ERROR:", err.message);
    res.status(500).json({ message: "Error fetching leaderboard" });
  }
};

/**
 * ============================================
 * 👤 USER PROFILE
 * ============================================
 *
 * Returns:
 * - basic info
 * - total solved
 * - submissions count
 * - recent submissions
 */
const getUserProfile = async (req, res) => {
  try {
    const username = req.params.username;

    /** 🔹 STEP 1: find user */
    const user = await User.findOne({
      username: { $regex: `^${username}$`, $options: "i" },
    }).lean();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    /** 🔹 STEP 2: get submissions */
    const submissions = await Submission.find({ user: user._id })
      .populate("problem", "title slug difficulty")
      .lean();

    /** 🔹 STEP 3: unique solved */
    const solvedSet = new Set();

    submissions.forEach((s) => {
      if (s.status === "solved" && s.problem) {
        solvedSet.add(s.problem._id.toString());
      }
    });

    /** 🔹 STEP 4: recent (latest 5) */
    const recent = submissions
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .map((s) => ({
        id: s._id,
        status: s.status,
        createdAt: s.createdAt,
        problem: s.problem,
      }));

    /** 🔹 STEP 5: response */
    res.json({
      username: user.username,
      email: user.email,
      rating: user.rating,

      totalSolved: solvedSet.size,
      totalSubmissions: submissions.length,

      recent,
    });
  } catch (err) {
    console.error("PROFILE ERROR:", err.message);
    res.status(500).json({ message: "Error fetching profile" });
  }
};

module.exports = {
  getLeaderboard,
  getUserProfile,
};
