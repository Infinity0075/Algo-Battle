export const problems = [
  // EASY

  {
    id: "two-sum",
    title: "Two Sum",
    difficulty: "Easy",
    category: "Array",
    description: "Find indices of two numbers that sum to target.",
    examples: [{ input: "[2,7,11,15], target=9", output: "[0,1]" }],
    constraints: ["2 <= n <= 10^4"],
    starterCode: {
      javascript: `function twoSum(nums, target) {
  // code here
}`,
      cpp: `vector<int> twoSum(vector<int>& nums, int target) {
  // code here
}`,
    },
  },

  {
    id: "reverse-array",
    title: "Reverse Array",
    difficulty: "Easy",
    category: "Array",
    description: "Reverse an array in-place.",
    examples: [{ input: "[1,2,3]", output: "[3,2,1]" }],
    constraints: [],
    starterCode: {
      javascript: `function reverseArray(arr) {
  // code here
}`,
      cpp: `void reverseArray(vector<int>& arr) {
  // code here
}`,
    },
  },

  {
    id: "palindrome-string",
    title: "Valid Palindrome",
    difficulty: "Easy",
    category: "String",
    description: "Check if string is palindrome.",
    examples: [{ input: "madam", output: "true" }],
    constraints: [],
    starterCode: {
      javascript: `function isPalindrome(str) {
  // code here
}`,
      cpp: `bool isPalindrome(string str) {
  // code here
}`,
    },
  },

  {
    id: "valid-anagram",
    title: "Valid Anagram",
    difficulty: "Easy",
    category: "String",
    description: "Check if two strings are anagrams.",
    examples: [{ input: "listen, silent", output: "true" }],
    constraints: [],
    starterCode: {
      javascript: `function isAnagram(s, t) {
  // code here
}`,
      cpp: `bool isAnagram(string s, string t) {
  // code here
}`,
    },
  },

  {
    id: "missing-number",
    title: "Missing Number",
    difficulty: "Easy",
    category: "Array",
    description: "Find missing number from 0 to n.",
    examples: [{ input: "[3,0,1]", output: "2" }],
    constraints: [],
    starterCode: {
      javascript: `function missingNumber(nums) {
  // code here
}`,
      cpp: `int missingNumber(vector<int>& nums) {
  // code here
}`,
    },
  },

  {
    id: "move-zeroes",
    title: "Move Zeroes",
    difficulty: "Easy",
    category: "Array",
    description: "Move all zeroes to end while maintaining order.",
    examples: [{ input: "[0,1,0,3,12]", output: "[1,3,12,0,0]" }],
    constraints: [],
    starterCode: {
      javascript: `function moveZeroes(nums) {
  // code here
}`,
      cpp: `void moveZeroes(vector<int>& nums) {
  // code here
}`,
    },
  },

  {
    id: "max-element",
    title: "Find Maximum Element",
    difficulty: "Easy",
    category: "Array",
    description: "Find maximum element in array.",
    examples: [{ input: "[1,5,3]", output: "5" }],
    constraints: [],
    starterCode: {
      javascript: `function maxElement(arr) {
  // code here
}`,
      cpp: `int maxElement(vector<int>& arr) {
  // code here
}`,
    },
  },

  {
    id: "reverse-string",
    title: "Reverse String",
    difficulty: "Easy",
    category: "String",
    description: "Reverse a string.",
    examples: [{ input: "hello", output: "olleh" }],
    constraints: [],
    starterCode: {
      javascript: `function reverseString(str) {
  // code here
}`,
      cpp: `string reverseString(string str) {
  // code here
}`,
    },
  },

  // 🟡 MEDIUM

  {
    id: "max-subarray",
    title: "Maximum Subarray",
    difficulty: "Medium",
    category: "Array",
    description: "Find maximum sum subarray.",
    examples: [{ input: "[-2,1,-3,4,-1,2,1,-5,4]", output: "6" }],
    constraints: [],
    starterCode: {
      javascript: `function maxSubArray(nums) {
  // code here
}`,
      cpp: `int maxSubArray(vector<int>& nums) {
  // code here
}`,
    },
  },

  {
    id: "longest-substring",
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    category: "String",
    description: "Find longest substring without repeating characters.",
    examples: [{ input: "abcabcbb", output: "3" }],
    constraints: [],
    starterCode: {
      javascript: `function lengthOfLongestSubstring(s) {
  // code here
}`,
      cpp: `int lengthOfLongestSubstring(string s) {
  // code here
}`,
    },
  },

  {
    id: "rotate-array",
    title: "Rotate Array",
    difficulty: "Medium",
    category: "Array",
    description: "Rotate array by k steps.",
    examples: [{ input: "[1,2,3,4,5], k=2", output: "[4,5,1,2,3]" }],
    constraints: [],
    starterCode: {
      javascript: `function rotate(nums, k) {
  // code here
}`,
      cpp: `void rotate(vector<int>& nums, int k) {
  // code here
}`,
    },
  },

  {
    id: "group-anagrams",
    title: "Group Anagrams",
    difficulty: "Medium",
    category: "String",
    description: "Group anagrams together.",
    examples: [{ input: '["eat","tea","tan","ate"]', output: "groups" }],
    constraints: [],
    starterCode: {
      javascript: `function groupAnagrams(strs) {
  // code here
}`,
      cpp: `vector<vector<string>> groupAnagrams(vector<string>& strs) {
  // code here
}`,
    },
  },

  {
    id: "binary-search",
    title: "Binary Search",
    difficulty: "Easy",
    category: "Search",
    description: "Find element using binary search.",
    examples: [{ input: "[1,2,3,4,5], target=3", output: "2" }],
    constraints: [],
    starterCode: {
      javascript: `function binarySearch(nums, target) {
  // code here
}`,
      cpp: `int binarySearch(vector<int>& nums, int target) {
  // code here
}`,
    },
  },

  {
    id: "merge-intervals",
    title: "Merge Intervals",
    difficulty: "Medium",
    category: "Array",
    description: "Merge overlapping intervals.",
    examples: [{ input: "[[1,3],[2,6]]", output: "[[1,6]]" }],
    constraints: [],
    starterCode: {
      javascript: `function merge(intervals) {
  // code here
}`,
      cpp: `vector<vector<int>> merge(vector<vector<int>>& intervals) {
  // code here
}`,
    },
  },

  {
    id: "product-array",
    title: "Product of Array Except Self",
    difficulty: "Medium",
    category: "Array",
    description: "Return array where each element is product except itself.",
    examples: [{ input: "[1,2,3,4]", output: "[24,12,8,6]" }],
    constraints: [],
    starterCode: {
      javascript: `function productExceptSelf(nums) {
  // code here
}`,
      cpp: `vector<int> productExceptSelf(vector<int>& nums) {
  // code here
}`,
    },
  },
];
