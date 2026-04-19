// 🔥 OPTIMIZED + production-safe

const mongoose = require("mongoose");
const Problem = require("../models/Problem");

// 🔥 GET ALL PROBLEMS
const getProblems = async (req, res) => {
  try {
    const problems = await Problem.find()
      .select("-__v") // 🔧 cleaner response
      .sort({ createdAt: -1 })
      .lean(); // 🔧 faster

    res.status(200).json(problems);
  } catch (err) {
    console.error("GET PROBLEMS ERROR:", err.message);
    res.status(500).json({ message: "Error fetching problems" });
  }
};

// 🔥 GET SINGLE PROBLEM
const getProblemById = async (req, res) => {
  try {
    const { id } = req.params;

    let problem;

    // 🔥 FIRST: try ObjectId
    if (mongoose.Types.ObjectId.isValid(id)) {
      problem = await Problem.findById(id);
    }

    // 🔥 SECOND: try slug (IMPORTANT)
    if (!problem) {
      problem = await Problem.findOne({ slug: id });
    }

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    res.status(200).json(problem);
  } catch (err) {
    console.error("GET SINGLE ERROR:", err);
    res.status(500).json({ message: "Error fetching problem" });
  }
};

// 🔥 CREATE PROBLEM
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
    } = req.body;

    if (!title || !difficulty || !description) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // 🔧 slug generation
    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // 🔧 prevent duplicate slug
    const exists = await Problem.findOne({ slug });
    if (exists) {
      return res.status(400).json({ message: "Problem already exists" });
    }

    const problem = await Problem.create({
      title,
      slug,
      difficulty,
      description,
      examples,
      constraints,
      starterCode,
      category,
    });

    res.status(201).json(problem);
  } catch (err) {
    console.error("CREATE ERROR:", err.message);
    res.status(500).json({ message: "Error creating problem" });
  }
};

// 🔥 UPDATE PROBLEM
const updateProblem = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid problem ID" });
    }

    // 🔧 if title updated → update slug too
    if (req.body.title) {
      req.body.slug = req.body.title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
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

// 🔥 DELETE PROBLEM
const deleteProblem = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid problem ID" });
    }

    const deleted = await Problem.findByIdAndDelete(id); // 🔧 simplified

    if (!deleted) {
      return res.status(404).json({ message: "Problem not found" });
    }

    res.status(200).json({ message: "Problem deleted successfully" });
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
