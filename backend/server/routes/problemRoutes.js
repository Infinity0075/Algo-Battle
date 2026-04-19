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

// 🔧 ADDED: param validation
const validateId = (req, res, next) => {
  const { id } = req.params;
  if (!id || id.length !== 24) {
    return res.status(400).json({ message: "Invalid ID" });
  }
  next();
};

// 🔓 PUBLIC ROUTES
router.get("/", getProblems);
router.get("/:id", getProblemById);
// 🔐 ADMIN ROUTES
router.post("/", protect, adminOnly, createProblem);
router.put("/:id", protect, adminOnly, validateId, updateProblem); // 🔧 added validation
router.delete("/:id", protect, adminOnly, validateId, deleteProblem); // 🔧 added validation

module.exports = router;
