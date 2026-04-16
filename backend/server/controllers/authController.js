const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Generate Token
const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not set");
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// REGISTER USER
const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    // 1. Check if user exists
    const userExists = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username }],
    });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 2. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Create user
    const user = await User.create({
      username,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    // 4. Send response with token
    res.status(201).json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// LOGIN USER
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }
    // 1. Check user exists
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // 2. Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // 3. Return user + token
    res.status(200).json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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
