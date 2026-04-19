// 🔥 FIXED: correct model paths + optimized + safe

const Submission = require("../models/Submission");
const Problem = require("../models/Problem");
const User = require("../models/User"); // 🔧 FIXED path

// ➤ CREATE SUBMISSION
const createSubmission = async (req, res) => {
  try {
    const { problemId, status, language } = req.body;
    const userId = req.user._id;

    if (!problemId) {
      return res.status(400).json({ message: "Problem ID required" });
    }

    const problem = await Problem.findById(problemId).lean();
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    const finalStatus = status === "Accepted" ? "solved" : "attempted";

    const alreadySolved = await Submission.exists({
      user: userId,
      problem: problemId,
      status: "solved",
    }); // 🔧 faster than findOne

    const submission = await Submission.create({
      user: userId,
      problem: problemId,
      status: finalStatus,
      language: language || "javascript",
    });

    // 🔧 only update rating if needed
    if (finalStatus === "solved" && !alreadySolved) {
      const inc =
        problem.difficulty === "Easy"
          ? 10
          : problem.difficulty === "Medium"
            ? 20
            : 30;

      await User.findByIdAndUpdate(userId, { $inc: { rating: inc } }); // 🔧 atomic update
    }

    res.status(201).json({
      message: alreadySolved
        ? "Already solved (no extra rating)"
        : "Submission recorded",
      submission,
    });
  } catch (err) {
    console.error("CREATE SUBMISSION ERROR:", err.message);
    res.status(500).json({ message: "Error creating submission" });
  }
};

// ➤ STATS
const getStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const submissions = await Submission.find({ user: userId })
      .populate("problem", "difficulty")
      .lean();

    const solvedSet = new Set();

    let easy = 0,
      medium = 0,
      hard = 0;

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
      totalSolved: solvedSet.size,
      totalSubmissions: submissions.length,
      easy,
      medium,
      hard,
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching stats" });
  }
};

// ➤ ACTIVITY
const getActivity = async (req, res) => {
  try {
    const submissions = await Submission.find({
      user: req.user._id,
      status: "solved",
    }).select("createdAt");

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

// ➤ RECENT
const getRecent = async (req, res) => {
  try {
    const submissions = await Submission.find({ user: req.user._id })
      .populate("problem", "title slug")
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    const formatted = submissions.map((s) => ({
      _id: s._id,
      status: s.status,
      createdAt: s.createdAt,
      problem: s.problem || null,
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: "Error fetching recent" });
  }
};

// ➤ STREAK
const getStreak = async (req, res) => {
  try {
    const submissions = await Submission.find({
      user: req.user._id,
      status: "solved",
    })
      .select("createdAt")
      .sort({ createdAt: -1 });

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
      } else break;
    }

    res.json({ streak });
  } catch (err) {
    res.status(500).json({ message: "Error fetching streak" });
  }
};

// ➤ PROBLEM STATUS
const getProblemStatus = async (req, res) => {
  try {
    const submissions = await Submission.find({ user: req.user._id }).lean();

    const statusMap = {};

    submissions.forEach((s) => {
      const id = s.problem?.toString();
      if (!id) return;

      if (s.status === "solved") statusMap[id] = "solved";
      else if (!statusMap[id]) statusMap[id] = "attempted";
    });

    res.json(statusMap);
  } catch (err) {
    res.status(500).json({ message: "Error fetching problem status" });
  }
};

// ➤ CLEAR (ADMIN)
const clearSubmissions = async (req, res) => {
  await Submission.deleteMany(); // 🔧 already protected via route
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
