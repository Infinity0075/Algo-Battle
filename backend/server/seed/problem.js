const problems = [
  {
    title: "Two Sum",
    slug: "two-sum",
    difficulty: "Easy",
    category: "Array",

    description: `
Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

Return the answer in any order.
    `,

    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
      },
    ],

    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
    ],

    functionName: "solution",

    starterCode: {
      javascript: `function solution(nums, target) {
  
}`,
    },

    testCases: [
      {
        input: "[[2,7,11,15],9]",
        output: "[0,1]",
      },
      {
        input: "[[3,2,4],6]",
        output: "[1,2]",
      },
    ],
  },

  {
    title: "Find Missing Number",
    slug: "missing-number",
    difficulty: "Easy",
    category: "Array",

    description: `
Given an array containing n distinct numbers taken from 0 to n, return the only number in the range that is missing.
    `,

    examples: [
      {
        input: "nums = [3,0,1]",
        output: "2",
      },
    ],

    constraints: ["1 <= n <= 10^4", "0 <= nums[i] <= n"],

    functionName: "solution",

    starterCode: {
      javascript: `function solution(nums) {
  
}`,
    },

    testCases: [
      {
        input: "[[3,0,1]]",
        output: "2",
      },
      {
        input: "[[0,1]]",
        output: "2",
      },
    ],
  },

  {
    title: "Valid Anagram",
    slug: "valid-anagram",
    difficulty: "Easy",
    category: "String",

    description: `
Given two strings s and t, return true if t is an anagram of s, and false otherwise.
    `,

    examples: [
      {
        input: "s = 'anagram', t = 'nagaram'",
        output: "true",
      },
    ],

    constraints: ["1 <= s.length, t.length <= 5 * 10^4"],

    functionName: "solution",

    starterCode: {
      javascript: `function solution(s, t) {
  
}`,
    },

    testCases: [
      {
        input: `["anagram","nagaram"]`,
        output: "true",
      },
      {
        input: `["rat","car"]`,
        output: "false",
      },
    ],
  },
];

module.exports = problems;
