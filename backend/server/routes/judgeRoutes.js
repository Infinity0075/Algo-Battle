const express = require("express");
const router = express.Router();

const { judgeCode } = require("../controllers/judgeController");

router.post("/", judgeCode);

module.exports = router;
