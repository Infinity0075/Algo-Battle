/**
 *
 * 📌 Strategy:
 * 1. Try Piston API (free execution)
 * 2. If fails → fallback to Node VM (JS only)
 *
 * ⚠️ Security:
 * - No new Function
 * - No process / require in VM
 *
 * 📌 Flow:
 * Request → wrap code → execute → compare → return result
 */

const vm = require("vm");
const Problem = require("../models/Problem");

/** ============================================
 * ⚙️ CONFIG
 * ============================================ */

const PISTON_URL = "https://emkc.org/api/v2/piston/execute";

// ✅ "node" for JS, correct python version
const LANG_CONFIG = {
  javascript: { language: "node", version: "18.15.0" },
  python: { language: "python", version: "3.10.0" },
};

/** ============================================
 * 🧩 WRAPPERS
 * ============================================ */

/**
 * Wrap user JS code into executable format
 * ✅ FIX: Using JSON.stringify(input) to safely embed input
 * ✅ FIX: Check if function exists before calling, give clear error
 */
const wrapJS = (code, input, fnName) => {
  const safeInput = JSON.stringify(input);

  return `
${code}

try {
  const __raw = ${safeInput};
  const __parsed = JSON.parse(__raw);
  const __args = Array.isArray(__parsed) ? __parsed : [__parsed];

  if (typeof ${fnName} !== 'function') {
    throw new Error('Function "${fnName}" is not defined. Make sure your function is named "${fnName}".');
  }

  const __result = ${fnName}(...__args);
  console.log(JSON.stringify(__result));
} catch (e) {
  console.error("RuntimeError: " + e.message);
}
`;
};

/**
 * Wrap Python code
 * ✅ FIX: Safely embed input and give clear error if fn not found
 */
const wrapPython = (code, input, fnName) => {
  const safeInput = JSON.stringify(input);

  return `
${code}

import json

try:
    __raw = ${safeInput}
    __parsed = json.loads(__raw)
    __args = __parsed if isinstance(__parsed, list) else [__parsed]

    if '${fnName}' not in dir():
        raise Exception('Function "${fnName}" is not defined. Make sure your function is named "${fnName}".')

    __result = ${fnName}(*__args)
    print(json.dumps(__result))
except Exception as e:
    print("RuntimeError:", str(e))
`;
};

const getWrapper = (lang) => (lang === "python" ? wrapPython : wrapJS);

/** ============================================
 * 🚀 PISTON EXECUTION
 * ============================================ */

const runViaPiston = async (code, langConfig) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout

  try {
    const res = await fetch(PISTON_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language: langConfig.language,
        version: langConfig.version,
        files: [{ content: code }],
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Piston HTTP ${res.status}: ${errText}`);
    }

    const data = await res.json();

    // 🔍 Debug log — remove in production
    console.log("[Piston Response]", JSON.stringify(data, null, 2));

    return data;
  } catch (err) {
    clearTimeout(timeout);
    throw err;
  }
};

/** ============================================
 * 🧠 VM FALLBACK (JS ONLY)
 * ============================================ */

const runViaVM = (code, input, fnName) => {
  const safeInput = JSON.stringify(input);

  const sandbox = {
    JSON,
    Math,
    Array,
    Object,
    String,
    Number,
    Boolean,
    console: {
      log: (...args) => {},
      error: (...args) => {},
    },
    result: null,
  };

  const script = new vm.Script(`
    ${code}

    try {
      const __raw = ${safeInput};
      const __parsed = JSON.parse(__raw);
      const __args = Array.isArray(__parsed) ? __parsed : [__parsed];

      if (typeof ${fnName} !== 'function') {
        result = '__ERROR__:Function "${fnName}" is not defined. Make sure your function is named "${fnName}".';
      } else {
        result = JSON.stringify(${fnName}(...__args));
      }
    } catch (e) {
      result = '__ERROR__:' + e.message;
    }
  `);

  vm.createContext(sandbox);
  script.runInContext(sandbox, { timeout: 3000 });

  return sandbox.result;
};

/** ============================================
 * 🎯 MAIN FUNCTION
 * ============================================ */

const runCode = async ({ code, language = "javascript", problemId }) => {
  if (!code || !problemId) {
    return { status: "Error", output: "Missing fields" };
  }

  /** 🔹 STEP 1: GET PROBLEM */
  const problem = await Problem.findById(problemId)
    .select("testCases functionName")
    .lean();

  if (!problem) {
    return { status: "Error", output: "Problem not found" };
  }

  // ✅ FIX: Trim and fallback if functionName missing in DB
  const fnName = (problem.functionName || "solution").trim();
  const testCases = problem.testCases || [];

  console.log(
    `[Judge] problemId: ${problemId} | lang: ${language} | fn: ${fnName}`,
  );

  if (!testCases.length) {
    return { status: "Error", output: "No test cases found for this problem" };
  }

  const langConfig = LANG_CONFIG[language];
  if (!langConfig) {
    return { status: "Error", output: `Unsupported language: ${language}` };
  }

  /** 🔹 STEP 2: EXECUTE EACH TEST CASE */
  for (let i = 0; i < testCases.length; i++) {
    const tc = testCases[i];
    let userOutput;

    try {
      /** 🔹 Try Piston */
      const wrapped = getWrapper(language)(code, tc.input, fnName);
      const data = await runViaPiston(wrapped, langConfig);

      // ✅ Check compile errors
      if (data.compile && data.compile.stderr) {
        return {
          status: "Compile Error",
          output: data.compile.stderr.trim(),
          testCase: i + 1,
        };
      }

      const stderr = (data.run?.stderr || "").trim();
      const stdout = (data.run?.stdout || "").trim();

      if (stderr) {
        return {
          status: "Runtime Error",
          output: stderr,
          testCase: i + 1,
        };
      }

      userOutput = stdout;
    } catch (err) {
      console.warn(`[Judge] Piston failed for test ${i + 1}:`, err.message);

      /** 🔹 Fallback VM — JS only */
      if (language === "javascript") {
        let vmOut;

        try {
          vmOut = runViaVM(code, tc.input, fnName);
        } catch (vmErr) {
          return {
            status: "Runtime Error",
            output: vmErr.message,
            testCase: i + 1,
          };
        }

        // ✅ FIX: null check before .startsWith
        if (!vmOut || vmOut.startsWith("__ERROR__:")) {
          return {
            status: "Runtime Error",
            output: vmOut
              ? vmOut.replace("__ERROR__:", "")
              : "Unknown error occurred",
            testCase: i + 1,
          };
        }

        userOutput = vmOut.trim();
      } else {
        // Python has no fallback — Piston is required
        return {
          status: "Error",
          output: `Could not connect to code execution server. Please try again. (${err.message})`,
        };
      }
    }

    /** 🔹 STEP 3: COMPARE OUTPUT */
    const expected = String(tc.output).trim();

    console.log(
      `[Judge] Test ${i + 1} | expected: "${expected}" | got: "${userOutput}"`,
    );

    if (userOutput !== expected) {
      return {
        status: "Wrong Answer",
        output: `Test case ${i + 1} failed`,
        expected,
        got: userOutput,
        testCase: i + 1,
      };
    }
  }

  /** 🔹 STEP 4: SUCCESS */
  return {
    status: "Accepted",
    output: "All test cases passed! 🎉",
  };
};

module.exports = { runCode };
