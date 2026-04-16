const Submission = require("../models/Submission");
const User = require("../models/User");

// 🔥 Leaderboard
const getLeaderboard = async (req, res) => {
  try {
    // 🔥 get all users sorted by rating
    const users = await User.find().sort({ rating: -1 }).limit(20);

    const leaderboard = [];

    for (let user of users) {
      // 🔥 count unique solved problems
      const submissions = await Submission.find({
        user: user._id,
        status: "solved",
      });

      const solvedSet = new Set(submissions.map((s) => s.problemId));

      leaderboard.push({
        username: user.username,
        solved: solvedSet.size,
        rating: user.rating,
      });
    }

    // ✅ return response (you forgot this before)
    res.json(leaderboard);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching leaderboard" });
  }
};
const getUserProfile = async (req, res) => {
  try {
    const username = req.params.username;

    console.log("Searching for:", username); // 🔥 ADD THIS

    const user = await User.findOne({
      username: { $regex: `^${username}$`, $options: "i" },
    });

    console.log("FOUND USER:", user); // 🔥 ADD THIS

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
      rating: user.rating,
      recent: submissions.slice(-5).reverse(),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching user" });
  }
};

module.exports = { getLeaderboard, getUserProfile };
