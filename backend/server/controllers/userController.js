const Submission = require("../models/Submission");
const User = require("../models/User");

const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await Submission.aggregate([
      { $match: { status: "solved" } },
      {
        $group: {
          _id: "$user",
          solvedProblems: { $addToSet: "$problemId" },
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
    ]);

    res.json(leaderboard);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching leaderboard" });
  }
};

// const Submission = require("../models/Submission");

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findOne({
      username: { $regex: `^${req.params.username}$`, $options: "i" },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ stats
    const submissions = await Submission.find({ user: user._id }).populate(
      "problem",
    );

    const solvedSet = new Set();

    submissions.forEach((s) => {
      if (s.status === "solved" && s.problem) {
        solvedSet.add(s.problem._id.toString());
      }
    });

    // ✅ recent activity (IMPORTANT)
    const recent = await Submission.find({ user: user._id })
      .populate("problem")
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      username: user.username,
      email: user.email,
      rating: user.rating,

      totalSolved: solvedSet.size,
      totalSubmissions: submissions.length,

      recent, // 🔥 THIS WAS MISSING / WRONG
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching profile" });
  }
};

module.exports = { getLeaderboard, getUserProfile };
