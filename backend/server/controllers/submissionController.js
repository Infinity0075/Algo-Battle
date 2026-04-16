const Submission = require("../models/Submission");

// ➤ Create Submission
const createSubmission = async (req, res) => {
  try {
    const { problemId, status, language } = req.body;
    const userId = req.user._id;

    if (!problemId) {
      return res.status(400).json({ message: "Problem ID required" });
    }

    // 🔥 check if already solved
    const alreadySolved = await Submission.findOne({
      user: userId,
      problemId,
      status: "solved",
    });

    // ✅ if already solved → don't duplicate
    if (alreadySolved) {
      return res.status(200).json({
        message: "Already solved",
        submission: alreadySolved,
      });
    }

    // ✅ create new submission
    const submission = await Submission.create({
      user: userId,
      problemId,
      status: status || "attempted",
      language: language || "javascript",
    });

    // 🔥 after submission created
    const user = await User.findById(req.user.id);

    if (status === "solved") {
      user.rating += 10;
    } else {
      user.rating += 2;
    }

    await user.save();

    res.status(201).json(submission);
  } catch (err) {
    console.error("CREATE ERROR:", err);
    res.status(500).json({ message: "Error creating submission" });
  }
};
// ➤ Stats
const getStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const submissions = await Submission.find({ user: userId });

    const solvedSet = new Set();

    submissions.forEach((s) => {
      if (s.status === "solved") {
        solvedSet.add(s.problemId);
      }
    });

    // 🔥 difficulty mapping (hardcoded for now)
    const problemsMap = {
      "two-sum": "Easy",
      "reverse-array": "Easy",
      "max-subarray": "Medium",
      "longest-substring": "Medium",
    };

    let easy = 0;
    let medium = 0;
    let hard = 0;

    solvedSet.forEach((id) => {
      const diff = problemsMap[id];

      if (diff === "Easy") easy++;
      else if (diff === "Medium") medium++;
      else if (diff === "Hard") hard++;
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

// ➤ Activity (ONLY solved)
const getActivity = async (req, res) => {
  try {
    const userId = req.user.id;

    const submissions = await Submission.find({
      user: userId,
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

// ➤ Recent
const getRecent = async (req, res) => {
  try {
    const userId = req.user.id;

    const submissions = await Submission.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(5);

    res.json(submissions);
  } catch (err) {
    res.status(500).json({ message: "Error fetching recent" });
  }
};

// ➤ STREAK SYSTEM
const getStreak = async (req, res) => {
  try {
    const userId = req.user.id;

    const submissions = await Submission.find({
      user: userId,
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

// get Problem Status
const getProblemStatus = async (req, res) => {
  try {
    const userId = req.user._id;

    const submissions = await Submission.find({ user: userId });

    const statusMap = {};

    submissions.forEach((s) => {
      if (s.status === "solved") {
        statusMap[s.problemId] = "solved";
      } else if (!statusMap[s.problemId]) {
        statusMap[s.problemId] = "attempted";
      }
    });

    res.json(statusMap);
  } catch (err) {
    res.status(500).json({ message: "Error fetching problem status" });
  }
};

module.exports = {
  createSubmission,
  getStats,
  getActivity,
  getRecent,
  getStreak,
  getProblemStatus,
};
