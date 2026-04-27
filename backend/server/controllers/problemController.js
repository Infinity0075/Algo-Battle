/**
 * ============================================
 * 📦 PROBLEM CONTROLLER
 * ============================================
 *
 * 📌 Responsibilities:
 * 1. Get all problems
 * 2. Get single problem (by ID or slug)
 * 3. Create problem (admin)
 * 4. Update problem (admin)
 * 5. Delete problem (admin)
 *
 * 📌 Flow:
 * Route → Controller → DB → Response
 */

const mongoose = require("mongoose");
const Problem = require("../models/Problem");

/**
 * ============================================
 * 🧠 HELPER: GENERATE SLUG
 * ============================================
 *
 * Converts title → URL friendly string
 * Example: "Two Sum Problem" → "two-sum-problem"
 */
const generateSlug = (title) =>
  title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

/**
 * ============================================
 * 📌 GET ALL PROBLEMS
 * ============================================
 *
 * Returns list of problems (no heavy fields)
 */
const getProblems = async (req, res) => {
  try {
    const problems = await Problem.find()
      .select("-__v -testCases") // 🔥 hide heavy data
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json(problems);
  } catch (err) {
    console.error("GET PROBLEMS ERROR:", err.message);
    res.status(500).json({ message: "Error fetching problems" });
  }
};

/**
 * ============================================
 * 📌 GET SINGLE PROBLEM
 * ============================================
 *
 * Supports:
 * - Mongo ID
 * - slug (SEO friendly)
 */
const getProblemById = async (req, res) => {
  try {
    const { id } = req.params;
    let problem;

    // 🔹 Try ObjectId
    if (mongoose.Types.ObjectId.isValid(id)) {
      problem = await Problem.findById(id).lean();
    }

    // 🔹 Try slug
    if (!problem) {
      problem = await Problem.findOne({ slug: id }).lean();
    }

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    res.status(200).json(problem);
  } catch (err) {
    console.error("GET PROBLEM ERROR:", err.message);
    res.status(500).json({ message: "Error fetching problem" });
  }
};

/**
 * ============================================
 * 📌 CREATE PROBLEM (ADMIN)
 * ============================================
 */
const createProblem = async (req, res) => {
  try {
    const {
      title,
      difficulty,
      description,
      examples,
      constraints,
      starterCode,
      category,
      testCases,
      functionName, // 🔥 IMPORTANT for judge
    } = req.body;

    // 🔹 Validation
    if (!title || !difficulty || !description) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const baseSlug = generateSlug(title);

    // 🔹 Ensure unique slug
    let slug = baseSlug;
    let count = 1;

    while (await Problem.findOne({ slug })) {
      slug = `${baseSlug}-${count++}`;
    }

    // 🔹 Create
    const problem = await Problem.create({
      title,
      slug,
      difficulty,
      description,
      examples,
      constraints,
      starterCode,
      category,
      testCases: testCases || [],
      functionName: functionName || "solution",
    });

    res.status(201).json(problem);
  } catch (err) {
    console.error("CREATE ERROR:", err.message);
    res.status(500).json({ message: "Error creating problem" });
  }
};

/**
 * ============================================
 * 📌 UPDATE PROBLEM (ADMIN)
 * ============================================
 */
const updateProblem = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    // 🔹 Update slug if title changes
    if (req.body.title) {
      const baseSlug = generateSlug(req.body.title);
      let slug = baseSlug;
      let count = 1;

      while (await Problem.findOne({ slug, _id: { $ne: id } })) {
        slug = `${baseSlug}-${count++}`;
      }

      req.body.slug = slug;
    }

    const updated = await Problem.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    }).select("-__v");

    if (!updated) {
      return res.status(404).json({ message: "Problem not found" });
    }

    res.status(200).json(updated);
  } catch (err) {
    console.error("UPDATE ERROR:", err.message);
    res.status(500).json({ message: "Error updating problem" });
  }
};

/**
 * ============================================
 * 📌 DELETE PROBLEM (ADMIN)
 * ============================================
 */
const deleteProblem = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const deleted = await Problem.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Problem not found" });
    }

    res.status(200).json({ message: "Problem deleted" });
  } catch (err) {
    console.error("DELETE ERROR:", err.message);
    res.status(500).json({ message: "Error deleting problem" });
  }
};

module.exports = {
  getProblems,
  getProblemById,
  createProblem,
  updateProblem,
  deleteProblem,
};
