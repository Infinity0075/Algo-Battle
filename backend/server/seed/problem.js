const mongoose = require("mongoose");
require("dotenv").config();

const Problem = require("../models/problemModel/Problem");

const problems = [
  // EASY
  {
    title: "Two Sum",
    difficulty: "Easy",
    description: "Find two indices such that their sum equals target.",
    examples: [{ input: "[2,7,11,15], target=9", output: "[0,1]" }],
  },
  {
    title: "Reverse String",
    difficulty: "Easy",
    description: "Reverse a string.",
    examples: [{ input: "hello", output: "olleh" }],
  },
  {
    title: "Palindrome Check",
    difficulty: "Easy",
    description: "Check if string is palindrome.",
    examples: [{ input: "madam", output: "true" }],
  },
  {
    title: "Missing Number",
    difficulty: "Easy",
    description: "Find missing number from 0 to n.",
    examples: [{ input: "[3,0,1]", output: "2" }],
  },
  {
    title: "Move Zeroes",
    difficulty: "Easy",
    description: "Move all zeroes to end.",
    examples: [{ input: "[0,1,0,3,12]", output: "[1,3,12,0,0]" }],
  },

  // MEDIUM
  {
    title: "Maximum Subarray",
    difficulty: "Medium",
    description: "Find maximum sum subarray.",
    examples: [{ input: "[-2,1,-3,4,-1,2,1,-5,4]", output: "6" }],
  },
  {
    title: "Longest Substring",
    difficulty: "Medium",
    description: "Longest substring without repeating characters.",
    examples: [{ input: "abcabcbb", output: "3" }],
  },
  {
    title: "Rotate Array",
    difficulty: "Medium",
    description: "Rotate array by k steps.",
    examples: [{ input: "[1,2,3,4,5], k=2", output: "[4,5,1,2,3]" }],
  },
  {
    title: "Group Anagrams",
    difficulty: "Medium",
    description: "Group anagrams.",
    examples: [{ input: "['eat','tea','tan']", output: "groups" }],
  },
  {
    title: "Merge Intervals",
    difficulty: "Medium",
    description: "Merge overlapping intervals.",
    examples: [{ input: "[[1,3],[2,6]]", output: "[[1,6]]" }],
  },

  // HARD
  {
    title: "Median of Two Arrays",
    difficulty: "Hard",
    description: "Find median of two sorted arrays.",
    examples: [{ input: "[1,3],[2]", output: "2" }],
  },
  {
    title: "Word Ladder",
    difficulty: "Hard",
    description: "Shortest transformation sequence.",
    examples: [{ input: "hit -> cog", output: "5" }],
  },
  {
    title: "N-Queens",
    difficulty: "Hard",
    description: "Place queens safely.",
    examples: [{ input: "n=4", output: "solutions" }],
  },

  // EXTRA (to reach ~20)
  {
    title: "Binary Search",
    difficulty: "Easy",
    description: "Find element using binary search.",
    examples: [{ input: "[1,2,3,4,5], target=3", output: "2" }],
  },
  {
    title: "Valid Anagram",
    difficulty: "Easy",
    description: "Check if two strings are anagrams.",
    examples: [{ input: "listen, silent", output: "true" }],
  },
  {
    title: "Product of Array",
    difficulty: "Medium",
    description: "Product except self.",
    examples: [{ input: "[1,2,3,4]", output: "[24,12,8,6]" }],
  },
  {
    title: "Climbing Stairs",
    difficulty: "Easy",
    description: "Ways to reach top.",
    examples: [{ input: "n=3", output: "3" }],
  },
  {
    title: "Coin Change",
    difficulty: "Medium",
    description: "Minimum coins needed.",
    examples: [{ input: "coins=[1,2,5], amount=11", output: "3" }],
  },
  {
    title: "LRU Cache",
    difficulty: "Hard",
    description: "Design LRU cache.",
    examples: [{ input: "operations", output: "result" }],
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");
    console.log("Connected to:", process.env.MONGO_URI);
    await Problem.deleteMany();

    await Problem.insertMany(problems);

    console.log("20 Problems Inserted ✅");

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDB();
