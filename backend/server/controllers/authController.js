/**

 *
 * 📌 Responsibilities:
 * 1. Register user
 * 2. Login user
 * 3. Get current user (me)
 *
 * 📌 Flow:
 * Request → Validate → DB → Token → Response
 */

const User = require("../models/User");
const jwt = require("jsonwebtoken");

/**
 
 *  GENERATE JWT TOKEN
 */
const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET not configured");
  }

  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

/**
 * REGISTER USER
 */
const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    /** 🔹 STEP 1: VALIDATION */
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const normalizedEmail = email.toLowerCase();

    /** 🔹 STEP 2: CHECK EXISTING */
    const exists = await User.findOne({
      $or: [{ email: normalizedEmail }, { username }],
    });

    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    /** 🔹 STEP 3: CREATE USER */
    const user = await User.create({
      username,
      email: normalizedEmail,
      password,
    });

    /** 🔹 STEP 4: RESPONSE */
    res.status(201).json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      token: generateToken(user._id),
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err.message);
    res.status(500).json({ message: "Registration failed" });
  }
};

/**
 
 *  LOGIN USER
 */
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    /** 🔹 STEP 1: VALIDATION */
    if (!email || !password) {
      return res.status(400).json({ message: "Email & password required" });
    }

    const normalizedEmail = email.toLowerCase();

    /** 🔹 STEP 2: FIND USER */
    const user = await User.findOne({ email: normalizedEmail }).select(
      "+password",
    );

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    /** 🔹 STEP 3: CHECK PASSWORD */
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    /** 🔹 STEP 4: RESPONSE */
    res.status(200).json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      token: generateToken(user._id),
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err.message);
    res.status(500).json({ message: "Login failed" });
  }
};

/**
 *
 * Requires auth middleware
 */
const getMe = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { _id, username, email, role } = req.user;

    res.json({
      id: _id,
      username,
      email,
      role,
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching user" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
};
