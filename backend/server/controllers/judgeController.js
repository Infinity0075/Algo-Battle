const { runCode } = require("../services/judgeService");

const judgeCode = async (req, res) => {
  try {
    const { code, language, problemId } = req.body;

    if (!code || !problemId) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const result = await runCode({ code, language });

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Judge error" });
  }
};

module.exports = { judgeCode };
