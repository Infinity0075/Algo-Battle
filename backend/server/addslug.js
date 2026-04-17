const mongoose = require("mongoose");
require("dotenv").config();

const Problem = require("./models/problemModel/Problem");
const connectDB = require("./config/db");

const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};

const addSlugs = async () => {
  try {
    await connectDB();

    const problems = await Problem.find();

    for (let problem of problems) {
      if (!problem.slug) {
        problem.slug = generateSlug(problem.title);
        await problem.save();
        console.log(`✅ Updated: ${problem.title}`);
      }
    }

    console.log("🔥 All slugs added!");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

addSlugs();
