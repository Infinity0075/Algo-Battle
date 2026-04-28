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
Given an array of integers nums and an integer target, return the indices of the two numbers such that they add up to the target.

You may assume that each input has exactly one solution, and you may not use the same element twice. You can return the answer in any order.

The goal is to efficiently find the pair without checking all combinations unnecessarily.
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

Given an array nums containing n distinct numbers taken from the range [0, n], return the only number that is missing from the array.

The array contains all numbers in the range except one. Your task is to identify the missing number efficiently.
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

An anagram is a word or phrase formed by rearranging the letters of another, using all the original letters exactly once.    `,

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
  {
    title: "3Sum",
    slug: "3sum",
    difficulty: "Medium",
    category: "Array",

    description: `
Given an integer array nums, return all the unique triplets [nums[i], nums[j], nums[k]] such that:

i != j, i != k, and j != k  
nums[i] + nums[j] + nums[k] == 0  

The solution set must not contain duplicate triplets.
  `,

    examples: [
      {
        input: "nums = [-1,0,1,2,-1,-4]",
        output: "[[-1,-1,2],[-1,0,1]]",
      },
    ],

    constraints: ["3 <= nums.length <= 3000", "-10^5 <= nums[i] <= 10^5"],

    functionName: "solution",

    starterCode: {
      javascript: `function solution(nums) {

}`,
    },

    testCases: [
      {
        input: "[[-1,0,1,2,-1,-4]]",
        output: "[[-1,-1,2],[-1,0,1]]",
      },
    ],
  },

  {
    title: "Longest Palindromic Substring",
    slug: "longest-palindromic-substring",
    difficulty: "Medium",
    category: "String",

    description: `
Given a string s, return the longest substring of s that is a palindrome.

A palindrome is a string that reads the same forward and backward.

If multiple substrings of the same maximum length exist, return any one of them.
  `,

    examples: [
      {
        input: 's = "babad"',
        output: '"bab"',
      },
    ],

    constraints: [
      "1 <= s.length <= 1000",
      "s consists of only letters and digits",
    ],

    functionName: "solution",

    starterCode: {
      javascript: `function solution(s) {

}`,
    },

    testCases: [
      {
        input: `["babad"]`,
        output: `"bab"`,
      },
    ],
  },

  {
    title: "Set Matrix Zeroes",
    slug: "set-matrix-zeroes",
    difficulty: "Medium",
    category: "Matrix",

    description: `
Given an m x n integer matrix, if an element is 0, set its entire row and column to 0.

You must perform this operation in-place, meaning you cannot use extra space proportional to the size of the matrix.
  `,

    examples: [
      {
        input: "matrix = [[1,1,1],[1,0,1],[1,1,1]]",
        output: "[[1,0,1],[0,0,0],[1,0,1]]",
      },
    ],

    constraints: [
      "m == matrix.length",
      "n == matrix[0].length",
      "1 <= m, n <= 200",
      "-2^31 <= matrix[i][j] <= 2^31 - 1",
    ],

    functionName: "solution",

    starterCode: {
      javascript: `function solution(matrix) {

}`,
    },

    testCases: [
      {
        input: "[[[1,1,1],[1,0,1],[1,1,1]]]",
        output: "[[1,0,1],[0,0,0],[1,0,1]]",
      },
    ],
  },

  {
    title: "Spiral Matrix",
    slug: "spiral-matrix",
    difficulty: "Medium",
    category: "Matrix",

    description: `
Given an m x n matrix, return all elements of the matrix in spiral order.

The spiral order starts from the top-left corner and proceeds in a clockwise direction, moving layer by layer.
  `,

    examples: [
      {
        input: "matrix = [[1,2,3],[4,5,6],[7,8,9]]",
        output: "[1,2,3,6,9,8,7,4,5]",
      },
    ],

    constraints: ["1 <= m, n <= 10", "-100 <= matrix[i][j] <= 100"],

    functionName: "solution",

    starterCode: {
      javascript: `function solution(matrix) {

}`,
    },

    testCases: [
      {
        input: "[[[1,2,3],[4,5,6],[7,8,9]]]",
        output: "[1,2,3,6,9,8,7,4,5]",
      },
    ],
  },

  {
    title: "Jump Game",
    slug: "jump-game",
    difficulty: "Medium",
    category: "Greedy",

    description: `
You are given an integer array nums. You are initially positioned at the first index.

Each element in the array represents your maximum jump length at that position.

From any position i, you can jump to any index between i and i + nums[i].

Return true if you can reach the last index, or false otherwise.
  `,

    examples: [
      {
        input: "nums = [2,3,1,1,4]",
        output: "true",
      },
      {
        input: "nums = [3,2,1,0,4]",
        output: "false",
      },
    ],

    constraints: ["1 <= nums.length <= 10^4", "0 <= nums[i] <= 10^5"],

    functionName: "solution",

    starterCode: {
      javascript: `function solution(nums) {

}`,
    },

    testCases: [
      {
        input: "[[2,3,1,1,4]]",
        output: "true",
      },
      {
        input: "[[3,2,1,0,4]]",
        output: "false",
      },
    ],
  },

  {
    title: "Gas Station",
    slug: "gas-station",
    difficulty: "Medium",
    category: "Greedy",

    description: `
There are n gas stations arranged in a circular route.

You are given two integer arrays:

gas[i]: the amount of gas available at station i  
cost[i]: the amount of gas required to travel from station i to station i + 1  

You have a car with an unlimited gas tank and start at one of the gas stations.

Return the starting station index if you can travel around the circuit once in the clockwise direction. Otherwise, return -1.
  `,

    examples: [
      {
        input: "gas = [1,2,3,4,5], cost = [3,4,5,1,2]",
        output: "3",
      },
    ],

    constraints: [
      "1 <= gas.length == cost.length <= 10^5",
      "0 <= gas[i], cost[i] <= 10^4",
    ],

    functionName: "solution",

    starterCode: {
      javascript: `function solution(gas, cost) {

}`,
    },

    testCases: [
      {
        input: "[[1,2,3,4,5],[3,4,5,1,2]]",
        output: "3",
      },
    ],
  },

  {
    title: "Daily Temperatures",
    slug: "daily-temperatures",
    difficulty: "Medium",
    category: "Stack",

    description: `
Given an array of daily temperatures, return an array such that for each day tells how many days you would have to wait until a warmer temperature.

If there is no future day for which this is possible, put 0 instead.
  `,

    examples: [
      {
        input: "temps = [73,74,75,71,69,72,76,73]",
        output: "[1,1,4,2,1,1,0,0]",
      },
    ],

    constraints: ["1 <= temps.length <= 10^5", "30 <= temps[i] <= 100"],

    functionName: "solution",

    starterCode: {
      javascript: `function solution(temps) {

}`,
    },

    testCases: [
      {
        input: "[[73,74,75,71,69,72,76,73]]",
        output: "[1,1,4,2,1,1,0,0]",
      },
    ],
  },

  {
    title: "Evaluate Reverse Polish Notation",
    slug: "reverse-polish-notation",
    difficulty: "Medium",
    category: "Stack",

    description: `
Evaluate the value of an arithmetic expression in Reverse Polish Notation.

Valid operators are +, -, *, and /.

Each operand may be an integer or another expression.
  `,

    examples: [
      {
        input: 'tokens = ["2","1","+","3","*"]',
        output: "9",
      },
    ],

    constraints: [
      "1 <= tokens.length <= 10^4",
      "tokens[i] is valid operator or integer",
    ],

    functionName: "solution",

    starterCode: {
      javascript: `function solution(tokens) {

}`,
    },

    testCases: [
      {
        input: `[["2","1","+","3","*"]]`,
        output: "9",
      },
    ],
  },

  {
    title: "Longest Consecutive Sequence",
    slug: "longest-consecutive-sequence",
    difficulty: "Medium",
    category: "Array",

    description: `
Given an unsorted array of integers nums, return the length of the longest consecutive elements sequence.

You must write an algorithm that runs in O(n) time.
  `,

    examples: [
      {
        input: "nums = [100,4,200,1,3,2]",
        output: "4",
      },
    ],

    constraints: ["0 <= nums.length <= 10^5", "-10^9 <= nums[i] <= 10^9"],

    functionName: "solution",

    starterCode: {
      javascript: `function solution(nums) {

}`,
    },

    testCases: [
      {
        input: "[[100,4,200,1,3,2]]",
        output: "4",
      },
    ],
  },

  {
    title: "Word Search",
    slug: "word-search",
    difficulty: "Medium",
    category: "Backtracking",

    description: `
Given an m x n grid of characters board and a string word, return true if word exists in the grid.

The word can be constructed from adjacent cells (horizontally or vertically).

The same cell may not be used more than once.
  `,

    examples: [
      {
        input:
          'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCCED"',
        output: "true",
      },
    ],

    constraints: [
      "m == board.length",
      "n == board[i].length",
      "1 <= m, n <= 6",
    ],

    functionName: "solution",

    starterCode: {
      javascript: `function solution(board, word) {

}`,
    },

    testCases: [
      {
        input: `[[["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]],"ABCCED"]`,
        output: "true",
      },
    ],
  },

  {
    title: "Palindrome Number",
    slug: "palindrome-number",
    difficulty: "Easy",
    category: "Math",

    description: `
Given an integer x, return true if x is a palindrome.

An integer is a palindrome when it reads the same backward as forward.
  `,

    examples: [
      {
        input: "x = 121",
        output: "true",
      },
    ],

    constraints: ["-2^31 <= x <= 2^31 - 1"],

    functionName: "solution",

    starterCode: {
      javascript: `function solution(x) {

}`,
    },

    testCases: [
      {
        input: "[121]",
        output: "true",
      },
    ],
  },

  {
    title: "Merge Sorted Arrays",
    slug: "merge-sorted-arrays",
    difficulty: "Easy",
    category: "Array",

    description: `
Given two sorted arrays, merge them into one sorted array.

The final array should also be sorted in ascending order.
  `,

    examples: [
      {
        input: "arr1 = [1,3,5], arr2 = [2,4,6]",
        output: "[1,2,3,4,5,6]",
      },
    ],

    constraints: ["1 <= arr1.length, arr2.length <= 10^4"],

    functionName: "solution",

    starterCode: {
      javascript: `function solution(arr1, arr2) {

}`,
    },

    testCases: [
      {
        input: "[[1,3,5],[2,4,6]]",
        output: "[1,2,3,4,5,6]",
      },
    ],
  },

  {
    title: "Fibonacci Number",
    slug: "fibonacci-number",
    difficulty: "Easy",
    category: "DP",

    description: `
The Fibonacci sequence is defined as:

F(0) = 0, F(1) = 1  
F(n) = F(n-1) + F(n-2) for n > 1

Given an integer n, return F(n).
  `,

    examples: [
      {
        input: "n = 5",
        output: "5",
      },
    ],

    constraints: ["0 <= n <= 30"],

    functionName: "solution",

    starterCode: {
      javascript: `function solution(n) {

}`,
    },

    testCases: [
      {
        input: "[5]",
        output: "5",
      },
    ],
  },

  {
    title: "Move Zeroes",
    slug: "move-zeroes",
    difficulty: "Easy",
    category: "Array",

    description: `
Given an integer array nums, move all 0's to the end of it while maintaining the relative order of the non-zero elements.

You must do this in-place without making a copy of the array.
  `,

    examples: [
      {
        input: "nums = [0,1,0,3,12]",
        output: "[1,3,12,0,0]",
      },
    ],

    constraints: ["1 <= nums.length <= 10^4", "-2^31 <= nums[i] <= 2^31 - 1"],

    functionName: "solution",

    starterCode: {
      javascript: `function solution(nums) {

}`,
    },

    testCases: [
      {
        input: "[[0,1,0,3,12]]",
        output: "[1,3,12,0,0]",
      },
    ],
  },

  {
    title: "Maximum Subarray",
    slug: "maximum-subarray",
    difficulty: "Medium",
    category: "Array",

    description: `
Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.

A subarray is a contiguous part of an array.

Your goal is to find the subarray with maximum possible sum efficiently.
  `,

    examples: [
      {
        input: "nums = [-2,1,-3,4,-1,2,1,-5,4]",
        output: "6",
      },
    ],

    constraints: ["1 <= nums.length <= 10^5", "-10^4 <= nums[i] <= 10^4"],

    functionName: "solution",

    starterCode: {
      javascript: `function solution(nums) {

}`,
    },

    testCases: [
      {
        input: "[[-2,1,-3,4,-1,2,1,-5,4]]",
        output: "6",
      },
    ],
  },

  {
    title: "Binary Search",
    slug: "binary-search",
    difficulty: "Easy",
    category: "Search",

    description: `
Given a sorted array of integers nums and a target value, return the index of the target if it exists.

If the target is not present, return -1.

You must write an algorithm with O(log n) time complexity.
  `,

    examples: [
      {
        input: "nums = [-1,0,3,5,9,12], target = 9",
        output: "4",
      },
    ],

    constraints: [
      "1 <= nums.length <= 10^4",
      "nums is sorted in ascending order",
    ],

    functionName: "solution",

    starterCode: {
      javascript: `function solution(nums, target) {

}`,
    },

    testCases: [
      {
        input: "[[-1,0,3,5,9,12],9]",
        output: "4",
      },
    ],
  },

  {
    title: "Reverse String",
    slug: "reverse-string",
    difficulty: "Easy",
    category: "String",

    description: `
Given a string s, return the reversed string.
  `,

    examples: [
      {
        input: 's = "hello"',
        output: '"olleh"',
      },
    ],

    constraints: ["1 <= s.length <= 10^5"],

    functionName: "solution",

    starterCode: {
      javascript: `function solution(s) {

}`,
    },

    testCases: [
      {
        input: `["hello"]`,
        output: `"olleh"`,
      },
    ],
  },

  {
    title: "Intersection of Two Arrays",
    slug: "intersection-arrays",
    difficulty: "Easy",
    category: "Array",

    description: `
Given two integer arrays nums1 and nums2, return their intersection.

Each element in the result must be unique.
  `,

    examples: [
      {
        input: "nums1 = [1,2,2,1], nums2 = [2,2]",
        output: "[2]",
      },
    ],

    constraints: ["1 <= nums1.length, nums2.length <= 10^4"],

    functionName: "solution",

    starterCode: {
      javascript: `function solution(nums1, nums2) {

}`,
    },

    testCases: [
      {
        input: "[[1,2,2,1],[2,2]]",
        output: "[2]",
      },
    ],
  },

  {
    title: "Power of Two",
    slug: "power-of-two",
    difficulty: "Easy",
    category: "Math",

    description: `
Given an integer n, return true if it is a power of two.

Otherwise, return false.
  `,

    examples: [
      {
        input: "n = 16",
        output: "true",
      },
    ],

    constraints: ["-2^31 <= n <= 2^31 - 1"],

    functionName: "solution",

    starterCode: {
      javascript: `function solution(n) {

}`,
    },

    testCases: [
      {
        input: "[16]",
        output: "true",
      },
    ],
  },

  {
    title: "Rotate Array",
    slug: "rotate-array",
    difficulty: "Medium",
    category: "Array",

    description: `
Given an array nums, rotate the array to the right by k steps.

The rotation should be done in-place.
  `,

    examples: [
      {
        input: "nums = [1,2,3,4,5,6,7], k = 3",
        output: "[5,6,7,1,2,3,4]",
      },
    ],

    constraints: ["1 <= nums.length <= 10^5", "0 <= k <= 10^5"],

    functionName: "solution",

    starterCode: {
      javascript: `function solution(nums, k) {

}`,
    },

    testCases: [
      {
        input: "[[1,2,3,4,5,6,7],3]",
        output: "[5,6,7,1,2,3,4]",
      },
    ],
  },

  {
    title: "Product of Array Except Self",
    slug: "product-except-self",
    difficulty: "Medium",
    category: "Array",

    description: `
Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements except nums[i].

You must solve it without using division and in O(n) time.
  `,

    examples: [
      {
        input: "nums = [1,2,3,4]",
        output: "[24,12,8,6]",
      },
    ],

    constraints: ["2 <= nums.length <= 10^5", "-30 <= nums[i] <= 30"],

    functionName: "solution",

    starterCode: {
      javascript: `function solution(nums) {

}`,
    },

    testCases: [
      {
        input: "[[1,2,3,4]]",
        output: "[24,12,8,6]",
      },
    ],
  },

  {
    title: "Happy Number",
    slug: "happy-number",
    difficulty: "Easy",
    category: "Math",

    description: `
A number is called happy if repeatedly replacing it with the sum of the squares of its digits eventually leads to 1.

Return true if n is a happy number.
  `,

    examples: [
      {
        input: "n = 19",
        output: "true",
      },
    ],

    constraints: ["1 <= n <= 2^31 - 1"],

    functionName: "solution",

    starterCode: {
      javascript: `function solution(n) {

}`,
    },

    testCases: [
      {
        input: "[19]",
        output: "true",
      },
    ],
  },

  {
    title: "Remove Duplicates",
    slug: "remove-duplicates",
    difficulty: "Easy",
    category: "Array",

    description: `
Given a sorted array nums, remove the duplicates in-place such that each unique element appears only once.

Return the new length of the array.

Do not allocate extra space for another array.
  `,

    examples: [
      {
        input: "nums = [1,1,2]",
        output: "2",
      },
    ],

    constraints: ["1 <= nums.length <= 10^4", "-10^4 <= nums[i] <= 10^4"],

    functionName: "solution",

    starterCode: {
      javascript: `function solution(nums) {

}`,
    },

    testCases: [
      {
        input: "[[1,1,2]]",
        output: "2",
      },
    ],
  },

  {
    title: "Valid Palindrome",
    slug: "valid-palindrome",
    difficulty: "Easy",
    category: "String",

    description: `
Given a string s, determine if it is a palindrome, considering only alphanumeric characters and ignoring cases.

Return true if it reads the same forward and backward.
  `,

    examples: [
      {
        input: 's = "A man, a plan, a canal: Panama"',
        output: "true",
      },
    ],

    constraints: ["1 <= s.length <= 2 * 10^5"],

    functionName: "solution",

    starterCode: {
      javascript: `function solution(s) {

}`,
    },

    testCases: [
      {
        input: `["A man, a plan, a canal: Panama"]`,
        output: "true",
      },
    ],
  },

  {
    title: "Climbing Stairs",
    slug: "climbing-stairs",
    difficulty: "Easy",
    category: "DP",

    description: `
You are climbing a staircase. It takes n steps to reach the top.

Each time you can either climb 1 step or 2 steps.

Return the number of distinct ways to reach the top.
  `,

    examples: [
      {
        input: "n = 3",
        output: "3",
      },
    ],

    constraints: ["1 <= n <= 45"],

    functionName: "solution",

    starterCode: {
      javascript: `function solution(n) {

}`,
    },

    testCases: [
      {
        input: "[3]",
        output: "3",
      },
    ],
  },

  {
    title: "House Robber",
    slug: "house-robber",
    difficulty: "Medium",
    category: "DP",

    description: `
You are given an array of integers nums where each element represents the amount of money in a house.

You cannot rob two adjacent houses because it will alert the police.

Return the maximum amount of money you can rob without triggering the alarm.
  `,

    examples: [
      {
        input: "nums = [1,2,3,1]",
        output: "4",
      },
    ],

    constraints: ["1 <= nums.length <= 100", "0 <= nums[i] <= 400"],

    functionName: "solution",

    starterCode: {
      javascript: `function solution(nums) {

}`,
    },

    testCases: [
      {
        input: "[[1,2,3,1]]",
        output: "4",
      },
    ],
  },

  {
    title: "Coin Change",
    slug: "coin-change",
    difficulty: "Medium",
    category: "DP",

    description: `
You are given an array of coin denominations and a total amount.

Return the minimum number of coins needed to make up that amount.

If it is not possible to make that amount, return -1.
  `,

    examples: [
      {
        input: "coins = [1,2,5], amount = 11",
        output: "3",
      },
    ],

    constraints: ["1 <= coins.length <= 12", "0 <= amount <= 10^4"],

    functionName: "solution",

    starterCode: {
      javascript: `function solution(coins, amount) {

}`,
    },

    testCases: [
      {
        input: "[[1,2,5],11]",
        output: "3",
      },
    ],
  },

  {
    title: "Longest Common Prefix",
    slug: "longest-common-prefix",
    difficulty: "Easy",
    category: "String",

    description: `
Given an array of strings, find the longest common prefix.

If there is no common prefix, return an empty string.
  `,

    examples: [
      {
        input: '["flower","flow","flight"]',
        output: '"fl"',
      },
    ],

    constraints: ["1 <= strs.length <= 200"],

    functionName: "solution",

    starterCode: {
      javascript: `function solution(strs) {

}`,
    },

    testCases: [
      {
        input: `[["flower","flow","flight"]]`,
        output: `"fl"`,
      },
    ],
  },

  {
    title: "Add Binary",
    slug: "add-binary",
    difficulty: "Easy",
    category: "String",

    description: `
Given two binary strings a and b, return their sum as a binary string.
  `,

    examples: [
      {
        input: 'a = "11", b = "1"',
        output: '"100"',
      },
    ],

    constraints: ["1 <= a.length, b.length <= 10^4"],

    functionName: "solution",

    starterCode: {
      javascript: `function solution(a, b) {

}`,
    },

    testCases: [
      {
        input: `["11","1"]`,
        output: `"100"`,
      },
    ],
  },

  {
    title: "Min Stack",
    slug: "min-stack",
    difficulty: "Medium",
    category: "Stack",

    description: `
Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.

All operations must run in O(1) time complexity.
  `,

    examples: [
      {
        input: '["push","push","push","getMin","pop","top","getMin"]',
        output: "[-3,0,-2]",
      },
    ],

    constraints: ["Operations count <= 10^5"],

    functionName: "solution",

    starterCode: {
      javascript: `function solution(ops) {

}`,
    },

    testCases: [
      {
        input: `[["push",-2],["push",0],["push",-3],["getMin"],["pop"],["top"],["getMin"]]`,
        output: "[-3,0,-2]",
      },
    ],
  },
];

module.exports = problems;
