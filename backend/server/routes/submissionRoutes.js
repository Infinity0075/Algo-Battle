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

const router = express.Router();

router.post("/", protect, createSubmission);
router.get("/stats", protect, getStats);
router.get("/activity", protect, getActivity);
router.get("/recent", protect, getRecent);
router.get("/streak", protect, getStreak);
router.get("/status", protect, getProblemStatus);
router.delete("/clear", clearSubmissions);

module.exports = router;
