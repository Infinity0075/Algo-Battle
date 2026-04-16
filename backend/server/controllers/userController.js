const Submission = require("../models/Submission");
const User = require("../models/User");

// 🔥 Leaderboard
const getLeaderboard = async (req, res) => {
  try {
    const users = await User.find();

    const leaderboard = [];

    for (let user of users) {
      const submissions = await Submission.find({ user: user._id });

      const solvedSet = new Set();

      submissions.forEach((s) => {
        if (s.status === "solved") {
          solvedSet.add(s.problemId);
        }
      });

      leaderboard.push({
        username: user.username,
        solved: solvedSet.size,
      });
    }

    // 🔥 sort by solved desc
    leaderboard.sort((a, b) => b.rating - a.rating);

    leaderboard.push({
      username: user.username,
      solved: solvedSet.size,
      rating: user.rating,
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching leaderboard" });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const submissions = await Submission.find({ user: user._id });

    const solvedSet = new Set();

    submissions.forEach((s) => {
      if (s.status === "solved") {
        solvedSet.add(s.problemId);
      }
    });

    res.json({
      username: user.username,
      email: user.email,
      totalSolved: solvedSet.size,
      totalSubmissions: submissions.length,
      recent: submissions.slice(-5).reverse(),
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching profile" });
  }
};

module.exports = { getLeaderboard, getUserProfile };
