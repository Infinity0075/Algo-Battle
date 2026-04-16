const express = require("express");
const router = express.Router();

const {
  getProblems,
  getProblemById,
  createProblem,
  updateProblem,
  deleteProblem,
} = require("../controllers/problemController");

const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

// 🔓 PUBLIC ROUTES
router.get("/", getProblems);
router.get("/:id", getProblemById);

// 🔐 ADMIN ROUTES
router.post("/", protect, adminOnly, createProblem);
router.put("/:id", protect, adminOnly, updateProblem);
router.delete("/:id", protect, adminOnly, deleteProblem);

module.exports = router;
