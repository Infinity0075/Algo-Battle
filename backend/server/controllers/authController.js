// 🔥 FIXED: correct model path + optimized + production safe

const User = require("../models/User"); // 🔧 FIXED path
const jwt = require("jsonwebtoken");

// 🔥 Generate Token
const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// 🔥 REGISTER USER
const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const normalizedEmail = email.toLowerCase();

    // 🔧 check existing
    const userExists = await User.findOne({
      $or: [{ email: normalizedEmail }, { username }],
    });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 🔧 let schema handle hashing (removed manual bcrypt)
    const user = await User.create({
      username,
      email: normalizedEmail,
      password,
    });

    res.status(201).json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role, // 🔧 added
      },
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔥 LOGIN USER
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const normalizedEmail = email.toLowerCase();

    // 🔧 include password explicitly (since select:false)
    const user = await User.findOne({ email: normalizedEmail }).select(
      "+password",
    );

    if (!user || !(await user.matchPassword(password))) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    res.status(200).json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      token: generateToken(user._id),
    });

    // ❌ REMOVED: unnecessary all users log (security + performance)
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔥 GET ME
const getMe = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { _id, username, email, role } = req.user;

  res.status(200).json({
    id: _id,
    username,
    email,
    role,
  });
};

module.exports = { registerUser, loginUser, getMe };
