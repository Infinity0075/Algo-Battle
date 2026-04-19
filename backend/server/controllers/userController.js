// 🔥 FIXED: correct fields + optimized aggregation + correct model path

const Submission = require("../models/Submission");
const User = require("../models/User"); // 🔧 FIXED path

// ➤ LEADERBOARD
const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await Submission.aggregate([
      { $match: { status: "solved" } },

      {
        $group: {
          _id: "$user",
          solvedProblems: { $addToSet: "$problem" }, // 🔧 FIXED (was problemId ❌)
        },
      },

      {
        $project: {
          solved: { $size: "$solvedProblems" },
        },
      },

      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },

      { $unwind: "$user" },

      {
        $project: {
          username: "$user.username",
          rating: "$user.rating",
          solved: 1,
        },
      },

      { $sort: { solved: -1, rating: -1 } },

      { $limit: 50 }, // 🔧 ADDED limit
    ]);

    res.json(leaderboard);
  } catch (err) {
    console.error("LEADERBOARD ERROR:", err.message);
    res.status(500).json({ message: "Error fetching leaderboard" });
  }
};

// ➤ USER PROFILE
const getUserProfile = async (req, res) => {
  try {
    const username = req.params.username;

    const user = await User.findOne({
      username: { $regex: `^${username}$`, $options: "i" },
    }).lean(); // 🔧 faster

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const submissions = await Submission.find({ user: user._id })
      .populate("problem", "_id title slug difficulty")
      .lean();

    const solvedSet = new Set();

    submissions.forEach((s) => {
      if (s.status === "solved" && s.problem) {
        solvedSet.add(s.problem._id.toString());
      }
    });

    const recent = submissions
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .map((s) => ({
        _id: s._id,
        status: s.status,
        createdAt: s.createdAt,
        problem: s.problem,
      }));

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

module.exports = { getLeaderboard, getUserProfile };
