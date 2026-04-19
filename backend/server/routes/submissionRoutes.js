const express = require("express");
const {
  createSubmission,
  getStats,
  getActivity,
  getRecent,
  getStreak,
  getProblemStatus,
  clearSubmissions,
} = require("../controllers/submissionController");

const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware"); // 🔧 ADDED

const router = express.Router();

// 🔥 ROUTES
router.post("/", protect, createSubmission);

router.get("/stats", protect, getStats);
router.get("/activity", protect, getActivity);
router.get("/recent", protect, getRecent);
router.get("/streak", protect, getStreak);
router.get("/status", protect, getProblemStatus);

// 🔧 FIX: dangerous route → admin only
router.delete("/clear", protect, adminOnly, clearSubmissions);

module.exports = router;
