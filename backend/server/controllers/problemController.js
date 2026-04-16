const Problem = require("../models/Problem");

// 🔥 GET ALL PROBLEMS
const getProblems = async (req, res) => {
  try {
    const problems = await Problem.find().sort({ createdAt: -1 });
    res.json(problems);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching problems" });
  }
};

// 🔥 GET SINGLE PROBLEM
const getProblemById = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    res.json(problem);
  } catch (err) {
    res.status(500).json({ message: "Error fetching problem" });
  }
};

// 🔥 CREATE PROBLEM (ADMIN ONLY)
const createProblem = async (req, res) => {
  try {
    const {
      title,
      difficulty,
      description,
      examples,
      constraints,
      starterCode,
    } = req.body;

    // ✅ basic validation
    if (!title || !difficulty || !description) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const problem = await Problem.create({
      title,
      difficulty,
      description,
      examples,
      constraints,
      starterCode,
    });

    res.status(201).json(problem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating problem" });
  }
};

// 🔥 UPDATE PROBLEM (ADMIN ONLY)
const updateProblem = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    const updated = await Problem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error updating problem" });
  }
};

// 🔥 DELETE PROBLEM (ADMIN ONLY)
const deleteProblem = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    await problem.deleteOne();

    res.json({ message: "Problem deleted successfully" });
  } catch (err) {
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
