const mongoose = require("mongoose");
require("dotenv").config();

const Problem = require("../server/models/Problem");
const connectDB = require("../server/config/db"); // 🔥 FIX PATH

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

    for (const problem of problems) {
      if (!problem.slug) {
        let baseSlug = generateSlug(problem.title);
        let slug = baseSlug;
        let count = 1;

        // 🔥 OPTIMIZED UNIQUE CHECK
        while (await Problem.exists({ slug })) {
          slug = `${baseSlug}-${count++}`;
        }

        problem.slug = slug;
        await problem.save();

        console.log(`✅ ${problem.title} → ${slug}`);
      }
    }

    console.log("🔥 All slugs added successfully!");
    process.exit();
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
};

addSlugs();
