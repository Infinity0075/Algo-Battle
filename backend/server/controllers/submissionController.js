/**
 * ============================================
 * 📦 SUBMISSION CONTROLLER
 * ============================================
 *
 * 📌 Responsibilities:
 * 1. Save submission
 * 2. Track stats (easy/medium/hard)
 * 3. Activity graph
 * 4. Recent submissions
 * 5. Streak system
 *
 * 📌 Flow:
 * User submits → Save → Update rating → Return response
 */

const Submission = require("../models/Submission");
const Problem = require("../models/Problem");
const User = require("../models/User");

/**
 * ============================================
 * 📌 CREATE SUBMISSION
 * ============================================
 *
 * Saves submission and updates user rating
 */
const createSubmission = async (req, res) => {
  try {
    const { problemId, status, language } = req.body;
    const userId = req.user._id;

    if (!problemId) {
      return res.status(400).json({ message: "Problem ID required" });
    }

    /** 🔹 STEP 1: VERIFY PROBLEM */
    const problem = await Problem.findById(problemId)
      .select("difficulty")
      .lean();

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    /** 🔹 STEP 2: NORMALIZE STATUS */
    const finalStatus = status === "Accepted" ? "solved" : "attempted";

    /** 🔹 STEP 3: CHECK IF ALREADY SOLVED */
    const alreadySolved = await Submission.exists({
      user: userId,
      problem: problemId,
      status: "solved",
    });

    /** 🔹 STEP 4: SAVE SUBMISSION */
    const submission = await Submission.create({
      user: userId,
      problem: problemId,
      status: finalStatus,
      language: language || "javascript",
    });

    /** 🔹 STEP 5: UPDATE RATING (ONLY ON FIRST SOLVE) */
    if (finalStatus === "solved" && !alreadySolved) {
      const points =
        problem.difficulty === "Easy"
          ? 10
          : problem.difficulty === "Medium"
            ? 20
            : 30;

      await User.findByIdAndUpdate(userId, {
        $inc: { rating: points },
      });
    }

    /** 🔹 STEP 6: RESPONSE */
    res.status(201).json({
      message: alreadySolved
        ? "Already solved (no extra points)"
        : "Submission recorded",
      submission,
    });
  } catch (err) {
    console.error("CREATE SUBMISSION ERROR:", err.message);
    res.status(500).json({ message: "Error creating submission" });
  }
};

/**
 * ============================================
 * 📊 GET USER STATS
 * ============================================
 *
 * Returns:
 * - total solved
 * - total submissions
 * - difficulty breakdown
 */
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
          else hard++;
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

/**
 * ============================================
 * 📅 ACTIVITY GRAPH
 * ============================================
 *
 * Returns daily solved count
 */
const getActivity = async (req, res) => {
  try {
    const submissions = await Submission.find({
      user: req.user._id,
      status: "solved",
    }).select("createdAt");

    const activity = {};

    submissions.forEach((s) => {
      const date = s.createdAt.toISOString().split("T")[0];
      activity[date] = (activity[date] || 0) + 1;
    });

    res.json(activity);
  } catch (err) {
    res.status(500).json({ message: "Error fetching activity" });
  }
};

/**
 * ============================================
 * 🕒 RECENT SUBMISSIONS
 * ============================================
 */
const getRecent = async (req, res) => {
  try {
    const submissions = await Submission.find({ user: req.user._id })
      .populate("problem", "title slug")
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    const formatted = submissions.map((s) => ({
      id: s._id,
      status: s.status,
      createdAt: s.createdAt,
      problem: s.problem,
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: "Error fetching recent" });
  }
};

/**
 * ============================================
 * 🔥 STREAK SYSTEM
 * ============================================
 *
 * Calculates consecutive solving days
 */
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

/**
 * ============================================
 * 📌 PROBLEM STATUS MAP
 * ============================================
 *
 * Returns:
 * { problemId: solved/attempted }
 */
const getProblemStatus = async (req, res) => {
  try {
    const submissions = await Submission.find({
      user: req.user._id,
    }).lean();

    const map = {};

    submissions.forEach((s) => {
      const id = s.problem?.toString();
      if (!id) return;

      if (s.status === "solved") map[id] = "solved";
      else if (!map[id]) map[id] = "attempted";
    });

    res.json(map);
  } catch (err) {
    res.status(500).json({ message: "Error fetching status" });
  }
};

/**
 * ============================================
 * 🧹 CLEAR ALL (ADMIN ONLY)
 * ============================================
 */
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
