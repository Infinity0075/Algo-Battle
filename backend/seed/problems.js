const mongoose = require("mongoose");
require("dotenv").config();

const Problem = require("../models/Problem");

const problems = [
  {
    title: "Two Sum",
    difficulty: "Easy",
    description: "Find two indices such that their sum equals target.",
    examples: [{ input: "[2,7,11,15], target=9", output: "[0,1]" }],
  },
  {
    title: "Reverse String",
    difficulty: "Easy",
    description: "Reverse a given string.",
    examples: [{ input: "hello", output: "olleh" }],
  },
  {
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    description:
      "Find the length of the longest substring without repeating characters.",
    examples: [{ input: "abcabcbb", output: "3" }],
  },
  {
    title: "Merge Intervals",
    difficulty: "Medium",
    description: "Merge overlapping intervals.",
    examples: [{ input: "[[1,3],[2,6],[8,10]]", output: "[[1,6],[8,10]]" }],
  },
  {
    title: "Median of Two Sorted Arrays",
    difficulty: "Hard",
    description: "Find the median of two sorted arrays.",
    examples: [{ input: "[1,3],[2]", output: "2" }],
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    // 🔥 clear old data (optional but recommended)
    await Problem.deleteMany();

    console.log("Old problems cleared");

    // 🔥 insert new
    await Problem.insertMany(problems);

    console.log("Problems inserted successfully");

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDB();
