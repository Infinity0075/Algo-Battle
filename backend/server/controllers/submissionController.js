const Submission = require("../models/Submission");
const Problem = require("../models/problemModel/Problem");
const User = require("../models/User");

// ➤ CREATE SUBMISSION
const createSubmission = async (req, res) => {
  try {
    const { problemId, status, language } = req.body;
    const userId = req.user._id;

    if (!problemId) {
      return res.status(400).json({ message: "Problem ID required" });
    }

    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    // ✅ FIX: ensure consistent status naming
    const finalStatus = status === "Accepted" ? "solved" : "attempted";

    const alreadySolved = await Submission.findOne({
      user: userId,
      problem: problemId,
      status: "solved",
    });

    const submission = await Submission.create({
      user: userId,
      problem: problemId,
      status: finalStatus,
      language: language || "javascript",
    });

    const user = await User.findById(userId);

    // ✅ rating update only first solve
    if (finalStatus === "solved" && !alreadySolved) {
      if (problem.difficulty === "Easy") user.rating += 10;
      else if (problem.difficulty === "Medium") user.rating += 20;
      else if (problem.difficulty === "Hard") user.rating += 30;
    }

    await user.save();

    res.status(201).json({
      message: alreadySolved
        ? "Already solved (no extra rating)"
        : "Submission recorded",
      submission,
    });
  } catch (err) {
    console.error("CREATE SUBMISSION ERROR:", err);
    res.status(500).json({ message: "Error creating submission" });
  }
};

// ➤ STATS (FIXED LOGIC)
const getStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const submissions = await Submission.find({ user: userId }).populate(
      "problem",
    );

    const solvedSet = new Set();

    let easy = 0;
    let medium = 0;
    let hard = 0;

    submissions.forEach((s) => {
      if (s.status === "solved" && s.problem) {
        const id = s.problem._id.toString();

        if (!solvedSet.has(id)) {
          solvedSet.add(id);

          if (s.problem.difficulty === "Easy") easy++;
          else if (s.problem.difficulty === "Medium") medium++;
          else if (s.problem.difficulty === "Hard") hard++;
        }
      }
    });

    res.json({
      totalSolved: solvedSet.size, // ✅ correct
      totalSubmissions: submissions.length, // ✅ correct
      easy,
      medium,
      hard,
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching stats" });
  }
};

// ➤ ACTIVITY (FIXED FORMAT)
const getActivity = async (req, res) => {
  try {
    const submissions = await Submission.find({
      user: req.user._id,
      status: "solved",
    });

    const activity = {};

    submissions.forEach((sub) => {
      const date = sub.createdAt.toISOString().split("T")[0];
      activity[date] = (activity[date] || 0) + 1;
    });

    res.json(activity);
  } catch (err) {
    res.status(500).json({ message: "Error fetching activity" });
  }
};

// ➤ RECENT (IMPORTANT FIX)
const getRecent = async (req, res) => {
  try {
    const submissions = await Submission.find({ user: req.user._id })
      .populate("problem")
      .sort({ createdAt: -1 })
      .limit(5);

    // ✅ FIX: map clean data for frontend
    const formatted = submissions.map((s) => ({
      _id: s._id,
      status: s.status,
      createdAt: s.createdAt,
      problem: {
        _id: s.problem?._id,
        title: s.problem?.title,
        slug: s.problem?.slug, // 🔥 IMPORTANT
      },
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: "Error fetching recent" });
  }
};

// ➤ STREAK (UNCHANGED)
const getStreak = async (req, res) => {
  try {
    const submissions = await Submission.find({
      user: req.user._id,
      status: "solved",
    }).sort({ createdAt: -1 });

    const days = new Set(
      submissions.map((s) => s.createdAt.toISOString().split("T")[0]),
    );

    let streak = 0;
    let currentDate = new Date();

    while (true) {
      const dateStr = currentDate.toISOString().split("T")[0];

      if (days.has(dateStr)) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    res.json({ streak });
  } catch (err) {
    res.status(500).json({ message: "Error fetching streak" });
  }
};

// ➤ PROBLEM STATUS (UNCHANGED)
const getProblemStatus = async (req, res) => {
  try {
    const submissions = await Submission.find({ user: req.user._id });

    const statusMap = {};

    submissions.forEach((s) => {
      const id = s.problem?.toString();

      if (!id) return;

      if (s.status === "solved") {
        statusMap[id] = "solved";
      } else if (!statusMap[id]) {
        statusMap[id] = "attempted";
      }
    });

    res.json(statusMap);
  } catch (err) {
    res.status(500).json({ message: "Error fetching problem status" });
  }
};

const clearSubmissions = async (req, res) => {
  await Submission.deleteMany();
  res.json({ message: "All submissions cleared" });
};

module.exports = {
  createSubmission,
  getStats,
  getActivity,
  getRecent,
  getStreak,
  getProblemStatus,
  clearSubmissions,
};
