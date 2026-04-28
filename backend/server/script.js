/**
 * ============================================
 * 🚀 MAIN SERVER (CLEAN - NO RATE LIMIT)
 * ============================================
 */

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const submissionRoutes = require("./routes/submissionRoutes");
const userRoutes = require("./routes/userRoutes");
const problemRoutes = require("./routes/problemRoutes");
const judgeRoutes = require("./routes/judgeRoutes");

const Problem = require("./models/Problem");
const { runCode } = require("./services/judgeService");

const app = express();

/** ================= DB ================= */
connectDB();

/** ================= SECURITY ================= */
app.set("trust proxy", 1);
app.use(helmet());
app.use(compression());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

/** ================= CORS ================= */
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
app.use(cors({ origin: FRONTEND_URL, credentials: true }));

/** ================= BODY ================= */
app.use(express.json({ limit: "10kb" }));

/** ================= HEALTH ================= */
app.get("/", (req, res) => {
  res.json({ status: "ok", ts: Date.now() });
});

/** ================= ROUTES ================= */
app.use("/api/auth", authRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/users", userRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/judge", judgeRoutes);

/** ================= 404 ================= */
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

/** ================= ERROR ================= */
app.use((err, req, res, next) => {
  console.error("ERROR:", err.message);
  res.status(500).json({
    message:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err.message,
  });
});

/** ================= SERVER ================= */
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: FRONTEND_URL, credentials: true },
});

/** ================= ROOMS ================= */
const rooms = new Map();

/** Cleanup old rooms */
setInterval(
  () => {
    const cutoff = Date.now() - 2 * 60 * 60 * 1000;

    for (const [id, room] of rooms.entries()) {
      if (room.createdAt < cutoff) {
        rooms.delete(id);
      }
    }
  },
  30 * 60 * 1000,
);

/** ================= SOCKET ================= */
io.on("connection", (socket) => {
  console.log("Connected:", socket.id);

  socket.on("join_room", ({ roomId, username }) => {
    if (
      !roomId ||
      typeof roomId !== "string" ||
      roomId.length > 50 ||
      !username ||
      typeof username !== "string" ||
      username.length > 20
    )
      return;

    socket.join(roomId);
    socket.roomId = roomId;
    socket.username = username;

    if (!rooms.has(roomId)) {
      rooms.set(roomId, {
        users: [],
        host: username, // ✅ FIXED (was socket.id)
        started: false,
        leaderboard: [],
        submissions: new Map(),
        createdAt: Date.now(),
      });
    }

    const room = rooms.get(roomId);

    if (!room.users.find((u) => u.id === socket.id)) {
      room.users.push({ id: socket.id, username });
    }

    io.to(roomId).emit("room_data", sanitizeRoom(room));
  });

  socket.on("start_battle", async () => {
    console.log("🚀 START REQUEST FROM:", socket.username);

    const room = rooms.get(socket.roomId);

    console.log("HOST:", room?.host, "CURRENT:", socket.username);

    // ✅ FIXED CHECK
    if (!room || socket.username !== room.host || room.started) {
      console.log("❌ BLOCKED START");
      return;
    }

    console.log("✅ STARTING BATTLE");

    try {
      const count = await Problem.countDocuments({
        "testCases.0": { $exists: true },
      });

      if (!count) return;

      const problem = await Problem.findOne({
        "testCases.0": { $exists: true },
      })
        .skip(Math.floor(Math.random() * count))
        .lean();

      const safeProblem = {
        _id: problem._id,
        title: problem.title,
        description: problem.description,
        difficulty: problem.difficulty,
        starterCode: problem.starterCode,
      };

      room.problemId = problem._id;
      room.startTime = Date.now();
      room.started = true;
      room.leaderboard = [];
      room.submissions.clear();

      io.to(socket.roomId).emit("battle_started", {
        startTime: room.startTime,
        problem: safeProblem,
      });
    } catch (err) {
      console.error(err.message);
    }
  });

  socket.on("code_change", ({ code }) => {
    if (!socket.roomId || typeof code !== "string" || code.length > 10000)
      return;

    socket.to(socket.roomId).emit("code_update", {
      code,
      from: socket.username,
    });
  });

  socket.on("submit_code", async ({ code, language }) => {
    const room = rooms.get(socket.roomId);
    if (!room || !room.started) return;

    if (!code || typeof code !== "string" || code.length > 10000) {
      return socket.emit("error", { message: "Invalid code" });
    }

    if (room.submissions.get(socket.id) === "Accepted") return;

    try {
      const result = await runCode({
        code,
        language: language || "javascript",
        problemId: room.problemId,
      });

      if (result.status === "Accepted") {
        room.submissions.set(socket.id, "Accepted");

        room.leaderboard.push({
          username: socket.username,
          time: Date.now() - room.startTime,
        });

        room.leaderboard.sort((a, b) => a.time - b.time);
        room.leaderboard.forEach((u, i) => (u.rank = i + 1));

        io.to(socket.roomId).emit("leaderboard_update", room.leaderboard);
      }

      socket.emit("submission_result", result);
    } catch (err) {
      console.error(err.message);
      socket.emit("error", { message: "Submission failed" });
    }
  });

  socket.on("disconnect", () => {
    const roomId = socket.roomId;
    if (!roomId || !rooms.has(roomId)) return;

    const room = rooms.get(roomId);

    room.users = room.users.filter((u) => u.id !== socket.id);

    // ✅ FIXED host reassignment (use username)
    if (room.host === socket.username) {
      room.host = room.users[0]?.username || null;
    }

    if (!room.users.length) {
      rooms.delete(roomId);
      return;
    }

    io.to(roomId).emit("room_data", sanitizeRoom(room));
  });
});

/** ================= HELPERS ================= */
const sanitizeRoom = (room) => ({
  users: room.users,
  host: room.host,
  started: room.started,
  leaderboard: room.leaderboard,
});

/** ================= START ================= */
const PORT = process.env.PORT || 5005;

server.listen(PORT, () => {
  console.log(`🚀 Server running on ${PORT}`);
});
