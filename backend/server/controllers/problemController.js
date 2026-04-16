const mongoose = require("mongoose");
const Problem = require("../models/problemModel/Problem");

// 🔥 GET ALL PROBLEMS
const getProblems = async (req, res) => {
  try {
    const problems = await Problem.find().sort({ createdAt: -1 });
    res.status(200).json(problems);
  } catch (err) {
    console.error("GET PROBLEMS ERROR:", err);
    res.status(500).json({ message: "Error fetching problems" });
  }
};

// 🔥 GET SINGLE PROBLEM
const getProblemById = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ check valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid problem ID" });
    }

    const problem = await Problem.findById(id);

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    res.status(200).json(problem);
  } catch (err) {
    console.error("GET SINGLE ERROR:", err);
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
      category,
    } = req.body;

    // ✅ validation
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
      category,
    });

    res.status(201).json(problem);
  } catch (err) {
    console.error("CREATE ERROR:", err);
    res.status(500).json({ message: "Error creating problem" });
  }
};

// 🔥 UPDATE PROBLEM (ADMIN ONLY)
const updateProblem = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid problem ID" });
    }

    const updated = await Problem.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ message: "Problem not found" });
    }

    res.status(200).json(updated);
  } catch (err) {
    console.error("UPDATE ERROR:", err);
    res.status(500).json({ message: "Error updating problem" });
  }
};

// 🔥 DELETE PROBLEM (ADMIN ONLY)
const deleteProblem = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid problem ID" });
    }

    const problem = await Problem.findById(id);

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    await problem.deleteOne();

    res.status(200).json({ message: "Problem deleted successfully" });
  } catch (err) {
    console.error("DELETE ERROR:", err);
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
