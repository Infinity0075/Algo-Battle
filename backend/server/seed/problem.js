const problems = [
  {
    title: "Two Sum",
    difficulty: "Easy",
    category: "Array",
    description:
      "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.",
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
    starterCode: {
      javascript: "function twoSum(nums, target) {\n  \n}",
      cpp: "vector<int> twoSum(vector<int>& nums, int target) {\n  \n}",
    },
  },

  // 🔥 FROM PDF (converted properly)
  {
    title: "Find Missing Number",
    difficulty: "Easy",
    category: "Array",
    description:
      "Given an array containing n distinct numbers taken from 0 to n, return the only number in the range that is missing.",
    examples: [
      {
        input: "nums = [3,0,1]",
        output: "2",
      },
    ],
    constraints: [
      "1 <= n <= 10^4",
      "0 <= nums[i] <= n",
      "All numbers are unique",
    ],
    starterCode: {
      javascript: "function missingNumber(nums) {\n  \n}",
      cpp: "int missingNumber(vector<int>& nums) {\n  \n}",
    },
  },

  {
    title: "Find Duplicate Number",
    difficulty: "Medium",
    category: "Array",
    description:
      "Given an array of integers nums containing n + 1 integers where each integer is in the range [1, n] inclusive.\n\nThere is only one repeated number in nums, return this repeated number.",
    examples: [
      {
        input: "nums = [1,3,4,2,2]",
        output: "2",
      },
    ],
    constraints: [
      "1 <= n <= 10^5",
      "nums.length == n + 1",
      "Only one duplicate exists",
    ],
    starterCode: {
      javascript: "function findDuplicate(nums) {\n  \n}",
      cpp: "int findDuplicate(vector<int>& nums) {\n  \n}",
    },
  },

  {
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    category: "String",
    description:
      "Given a string s, find the length of the longest substring without repeating characters.",
    examples: [
      {
        input: "s = 'abcabcbb'",
        output: "3",
      },
    ],
    constraints: ["0 <= s.length <= 5 * 10^4", "s consists of English letters"],
    starterCode: {
      javascript: "function lengthOfLongestSubstring(s) {\n  \n}",
      cpp: "int lengthOfLongestSubstring(string s) {\n  \n}",
    },
  },

  {
    title: "Valid Anagram",
    difficulty: "Easy",
    category: "String",
    description:
      "Given two strings s and t, return true if t is an anagram of s, and false otherwise.",
    examples: [
      {
        input: "s = 'anagram', t = 'nagaram'",
        output: "true",
      },
    ],
    constraints: ["1 <= s.length, t.length <= 5 * 10^4"],
    starterCode: {
      javascript: "function isAnagram(s, t) {\n  \n}",
      cpp: "bool isAnagram(string s, string t) {\n  \n}",
    },
  },

  {
    title: "Reverse Array",
    difficulty: "Easy",
    category: "Array",
    description:
      "Given an array, reverse the array in-place without using extra space.",
    examples: [
      {
        input: "[1,2,3,4]",
        output: "[4,3,2,1]",
      },
    ],
    constraints: ["1 <= arr.length <= 10^5"],
    starterCode: {
      javascript: "function reverseArray(arr) {\n  \n}",
      cpp: "void reverseArray(vector<int>& arr) {\n  \n}",
    },
  },
  {
    title: "Majority Element",
    difficulty: "Easy",
    category: "Array",
    description:
      "Given an array nums, return the majority element (appears more than n/2 times).",
    examples: [{ input: "[3,2,3]", output: "3" }],
    constraints: ["1 <= n <= 10^5"],
    starterCode: {
      javascript: "function majorityElement(nums) {\n  \n}",
      cpp: "int majorityElement(vector<int>& nums) {\n  \n}",
    },
  },

  {
    title: "Best Time to Buy and Sell Stock",
    difficulty: "Easy",
    category: "Array",
    description: "Find max profit from one buy and one sell.",
    examples: [{ input: "[7,1,5,3,6,4]", output: "5" }],
    constraints: ["1 <= prices.length <= 10^5"],
    starterCode: {
      javascript: "function maxProfit(prices) {\n  \n}",
      cpp: "int maxProfit(vector<int>& prices) {\n  \n}",
    },
  },

  {
    title: "Single Number",
    difficulty: "Easy",
    category: "Array",
    description: "Find element that appears once, others appear twice.",
    examples: [{ input: "[4,1,2,1,2]", output: "4" }],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function singleNumber(nums) {\n  \n}",
      cpp: "int singleNumber(vector<int>& nums) {\n  \n}",
    },
  },

  {
    title: "Container With Most Water",
    difficulty: "Medium",
    category: "Array",
    description: "Find max water container between vertical lines.",
    examples: [{ input: "[1,8,6,2,5,4,8,3,7]", output: "49" }],
    constraints: ["2 <= n <= 10^5"],
    starterCode: {
      javascript: "function maxArea(height) {\n  \n}",
      cpp: "int maxArea(vector<int>& height) {\n  \n}",
    },
  },

  {
    title: "Trapping Rain Water",
    difficulty: "Hard",
    category: "Array",
    description: "Calculate trapped rain water.",
    examples: [{ input: "[0,1,0,2,1,0,1,3,2,1,2,1]", output: "6" }],
    constraints: ["1 <= n <= 10^5"],
    starterCode: {
      javascript: "function trap(height) {\n  \n}",
      cpp: "int trap(vector<int>& height) {\n  \n}",
    },
  },

  {
    title: "Valid Parentheses",
    difficulty: "Easy",
    category: "Stack",
    description: "Check if parentheses are valid.",
    examples: [{ input: "()[]{}", output: "true" }],
    constraints: ["1 <= s.length <= 10^4"],
    starterCode: {
      javascript: "function isValid(s) {\n  \n}",
      cpp: "bool isValid(string s) {\n  \n}",
    },
  },

  {
    title: "Min Stack",
    difficulty: "Medium",
    category: "Stack",
    description: "Design stack supporting getMin in O(1).",
    examples: [{ input: "operations", output: "values" }],
    constraints: ["Operations <= 10^5"],
    starterCode: {
      javascript: "class MinStack {\n  constructor() {}\n}",
      cpp: "class MinStack {\n};",
    },
  },

  {
    title: "Binary Tree Inorder Traversal",
    difficulty: "Easy",
    category: "Tree",
    description: "Return inorder traversal of binary tree.",
    examples: [{ input: "[1,null,2,3]", output: "[1,3,2]" }],
    constraints: ["Nodes <= 10^4"],
    starterCode: {
      javascript: "function inorderTraversal(root) {\n  \n}",
      cpp: "vector<int> inorderTraversal(TreeNode* root) {\n  \n}",
    },
  },

  {
    title: "Maximum Depth of Binary Tree",
    difficulty: "Easy",
    category: "Tree",
    description: "Find max depth of tree.",
    examples: [{ input: "[3,9,20,null,null,15,7]", output: "3" }],
    constraints: ["Nodes <= 10^4"],
    starterCode: {
      javascript: "function maxDepth(root) {\n  \n}",
      cpp: "int maxDepth(TreeNode* root) {\n  \n}",
    },
  },

  {
    title: "Same Tree",
    difficulty: "Easy",
    category: "Tree",
    description: "Check if two trees are identical.",
    examples: [{ input: "p=[1,2,3], q=[1,2,3]", output: "true" }],
    constraints: ["Nodes <= 10^4"],
    starterCode: {
      javascript: "function isSameTree(p, q) {\n  \n}",
      cpp: "bool isSameTree(TreeNode* p, TreeNode* q) {\n  \n}",
    },
  },

  {
    title: "Number of Islands",
    difficulty: "Medium",
    category: "Graph",
    description: "Count islands in grid.",
    examples: [{ input: "grid", output: "3" }],
    constraints: ["m,n <= 300"],
    starterCode: {
      javascript: "function numIslands(grid) {\n  \n}",
      cpp: "int numIslands(vector<vector<char>>& grid) {\n  \n}",
    },
  },

  {
    title: "Course Schedule",
    difficulty: "Medium",
    category: "Graph",
    description: "Check if all courses can be finished.",
    examples: [
      { input: "numCourses=2, prerequisites=[[1,0]]", output: "true" },
    ],
    constraints: ["1 <= n <= 10^5"],
    starterCode: {
      javascript: "function canFinish(numCourses, prerequisites) {\n  \n}",
      cpp: "bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {\n  \n}",
    },
  },

  {
    title: "Climbing Stairs",
    difficulty: "Easy",
    category: "DP",
    description: "Ways to reach top.",
    examples: [{ input: "n=3", output: "3" }],
    constraints: ["1 <= n <= 45"],
    starterCode: {
      javascript: "function climbStairs(n) {\n  \n}",
      cpp: "int climbStairs(int n) {\n  \n}",
    },
  },

  {
    title: "House Robber",
    difficulty: "Medium",
    category: "DP",
    description: "Max money without robbing adjacent houses.",
    examples: [{ input: "[1,2,3,1]", output: "4" }],
    constraints: ["1 <= n <= 100"],
    starterCode: {
      javascript: "function rob(nums) {\n  \n}",
      cpp: "int rob(vector<int>& nums) {\n  \n}",
    },
  },

  {
    title: "Coin Change",
    difficulty: "Medium",
    category: "DP",
    description: "Minimum coins needed.",
    examples: [{ input: "coins=[1,2,5], amount=11", output: "3" }],
    constraints: ["1 <= amount <= 10^4"],
    starterCode: {
      javascript: "function coinChange(coins, amount) {\n  \n}",
      cpp: "int coinChange(vector<int>& coins, int amount) {\n  \n}",
    },
  },

  {
    title: "Longest Increasing Subsequence",
    difficulty: "Medium",
    category: "DP",
    description: "Find LIS length.",
    examples: [{ input: "[10,9,2,5,3,7,101,18]", output: "4" }],
    constraints: ["1 <= n <= 2500"],
    starterCode: {
      javascript: "function lengthOfLIS(nums) {\n  \n}",
      cpp: "int lengthOfLIS(vector<int>& nums) {\n  \n}",
    },
  },

  {
    title: "Kth Largest Element",
    difficulty: "Medium",
    category: "Heap",
    description: "Find kth largest element.",
    examples: [{ input: "[3,2,1,5,6,4], k=2", output: "5" }],
    constraints: ["1 <= n <= 10^5"],
    starterCode: {
      javascript: "function findKthLargest(nums, k) {\n  \n}",
      cpp: "int findKthLargest(vector<int>& nums, int k) {\n  \n}",
    },
  },

  {
    title: "Top K Frequent Elements",
    difficulty: "Medium",
    category: "Heap",
    description: "Return k most frequent elements.",
    examples: [{ input: "[1,1,1,2,2,3], k=2", output: "[1,2]" }],
    constraints: ["1 <= n <= 10^5"],
    starterCode: {
      javascript: "function topKFrequent(nums, k) {\n  \n}",
      cpp: "vector<int> topKFrequent(vector<int>& nums, int k) {\n  \n}",
    },
  },

  {
    title: "Search in Rotated Sorted Array",
    difficulty: "Medium",
    category: "Binary Search",
    description: "Search element in rotated array.",
    examples: [{ input: "[4,5,6,7,0,1,2], target=0", output: "4" }],
    constraints: ["1 <= n <= 10^4"],
    starterCode: {
      javascript: "function search(nums, target) {\n  \n}",
      cpp: "int search(vector<int>& nums, int target) {\n  \n}",
    },
  },

  {
    title: "Find Peak Element",
    difficulty: "Medium",
    category: "Binary Search",
    description: "Find peak element.",
    examples: [{ input: "[1,2,3,1]", output: "2" }],
    constraints: ["1 <= n <= 10^5"],
    starterCode: {
      javascript: "function findPeakElement(nums) {\n  \n}",
      cpp: "int findPeakElement(vector<int>& nums) {\n  \n}",
    },
  },
];
