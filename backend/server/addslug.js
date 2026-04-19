// 🔥 IMPROVED: avoids duplicate slug crash

const mongoose = require("mongoose");
require("dotenv").config();

const Problem = require("../server/models/Problem");
const connectDB = require("./config/db");

const generateSlug = (title) =>
  title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const addSlugs = async () => {
  try {
    await connectDB();

    const problems = await Problem.find();

    for (let problem of problems) {
      if (!problem.slug) {
        let baseSlug = generateSlug(problem.title);
        let slug = baseSlug;
        let count = 1;

        // 🔧 ensure unique slug
        while (await Problem.findOne({ slug })) {
          slug = `${baseSlug}-${count++}`;
        }

        problem.slug = slug;
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
