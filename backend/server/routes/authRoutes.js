const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const {
  registerUser,
  loginUser,
  getMe,
} = require("../controllers/authController");

// 🔧 ADDED: basic validation middleware
const validateAuth = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  next();
};

// 🔥 ROUTES
router.post("/register", validateAuth, registerUser); // 🔧 validation added
router.post("/login", validateAuth, loginUser); // 🔧 validation added
router.get("/me", protect, getMe);

module.exports = router;
