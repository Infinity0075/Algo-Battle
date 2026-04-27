/**
 * ============================================
 * 🧠 JUDGE SERVICE (FINAL VERSION)
 * ============================================
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
const fetch = require("node-fetch"); // 🔧 IMPORTANT
const Problem = require("../models/Problem");

/** ============================================
 * ⚙️ CONFIG
 * ============================================ */

const PISTON_URL = "https://emkc.org/api/v2/piston/execute";

const LANG_CONFIG = {
  javascript: { language: "javascript", version: "18.15.0" },
  python: { language: "python", version: "3.10.0" },
};

/** ============================================
 * 🧩 WRAPPERS
 * ============================================ */

/**
 * Wrap user JS code into executable format
 */
const wrapJS = (code, input, fnName) => `
${code}

try {
  const args = JSON.parse('[${input}]');
  const result = ${fnName}(...args);
  console.log(JSON.stringify(result));
} catch (e) {
  console.error("RuntimeError: " + e.message);
}
`;

/**
 * Wrap Python code
 */
const wrapPython = (code, input, fnName) => `
${code}

import json
try:
    args = json.loads('[${input}]')
    result = ${fnName}(*args)
    print(json.dumps(result))
except Exception as e:
    print("RuntimeError:", str(e))
`;

const getWrapper = (lang) => (lang === "python" ? wrapPython : wrapJS);

/** ============================================
 * 🚀 PISTON EXECUTION
 * ============================================ */

const runViaPiston = async (code, langConfig) => {
  const res = await fetch(PISTON_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      language: langConfig.language,
      version: langConfig.version,
      files: [{ content: code }],
    }),
  });

  if (!res.ok) throw new Error("Piston failed");

  return res.json();
};

/** ============================================
 * 🧠 VM FALLBACK (JS ONLY)
 * ============================================ */

const runViaVM = (code, input, fnName) => {
  const sandbox = {
    JSON,
    Math,
    console: { log: () => {} },
    result: null,
  };

  const script = new vm.Script(`
    ${code}
    try {
      const args = JSON.parse('[${input}]');
      result = JSON.stringify(${fnName}(...args));
    } catch (e) {
      result = "__ERROR__:" + e.message;
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

  const fnName = problem.functionName || "solution";
  const testCases = problem.testCases || [];

  if (!testCases.length) {
    return { status: "Error", output: "No test cases" };
  }

  /** 🔹 STEP 2: EXECUTE EACH TEST CASE */
  for (let i = 0; i < testCases.length; i++) {
    const tc = testCases[i];
    let userOutput;

    try {
      /** 🔹 Try Piston */
      const wrapped = getWrapper(language)(code, tc.input, fnName);
      const data = await runViaPiston(wrapped, LANG_CONFIG[language]);

      if (data.run.stderr) {
        return {
          status: "Runtime Error",
          output: data.run.stderr,
          testCase: i + 1,
        };
      }

      userOutput = (data.run.stdout || "").trim();
    } catch (err) {
      /** 🔹 Fallback VM */
      if (language === "javascript") {
        const vmOut = runViaVM(code, tc.input, fnName);

        if (vmOut.startsWith("__ERROR__")) {
          return {
            status: "Runtime Error",
            output: vmOut.replace("__ERROR__:", ""),
            testCase: i + 1,
          };
        }

        userOutput = vmOut.trim();
      } else {
        return {
          status: "Error",
          output: "Judge unavailable",
        };
      }
    }

    /** 🔹 STEP 3: COMPARE OUTPUT */
    const expected = tc.output.trim();

    if (userOutput !== expected) {
      return {
        status: "Wrong Answer",
        output: `Test ${i + 1} failed`,
        expected,
        got: userOutput,
      };
    }
  }

  /** 🔹 STEP 4: SUCCESS */
  return {
    status: "Accepted",
    output: "All test cases passed",
  };
};

module.exports = { runCode };
