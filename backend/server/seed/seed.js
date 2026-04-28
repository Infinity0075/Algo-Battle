const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = require("../config/db");
const Problem = require("../models/Problem");
const problems = require("./problem");

const seedDB = async () => {
  try {
    await connectDB();

    // 🔥 CLEAR OLD DATA (important)
    await Problem.deleteMany();

    // 🔥 INSERT NEW
    await Problem.insertMany(problems);

    console.log("✅ Problems seeded successfully");
    process.exit();
  } catch (err) {
    console.error("❌ Seed error:", err.message);
    process.exit(1);
  }
};

seedDB();
