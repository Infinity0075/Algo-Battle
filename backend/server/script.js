/**
 * ============================================
 * 🚀 MAIN SERVER (CLEAN PRODUCTION VERSION)
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

/** ================= CLEANUP ================= */
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
  socket.on("join_room", ({ roomId, username }) => {
    if (!roomId || !username) return;

    socket.join(roomId);
    socket.roomId = roomId;
    socket.username = username;

    if (!rooms.has(roomId)) {
      rooms.set(roomId, {
        users: [],
        host: socket.id,
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

  /** ================= START BATTLE ================= */
  socket.on("start_battle", async () => {
    const room = rooms.get(socket.roomId);

    if (!room || socket.id !== room.host || room.started) return;

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

  /** ================= CODE SYNC ================= */
  socket.on("code_change", ({ code }) => {
    if (!socket.roomId) return;

    socket.to(socket.roomId).emit("code_update", {
      code,
      from: socket.username,
    });
  });

  /** ================= SUBMIT ================= */
  socket.on("submit_code", async ({ code, language }) => {
    const room = rooms.get(socket.roomId);
    if (!room || !room.started) return;

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
      socket.emit("error", { message: "Submission failed" });
    }
  });

  /** ================= DISCONNECT ================= */
  socket.on("disconnect", () => {
    const room = rooms.get(socket.roomId);
    if (!room) return;

    room.users = room.users.filter((u) => u.id !== socket.id);

    if (room.host === socket.id) {
      room.host = room.users[0]?.id || null;
    }

    if (!room.users.length) {
      rooms.delete(socket.roomId);
      return;
    }

    io.to(socket.roomId).emit("room_data", sanitizeRoom(room));
  });
});

/** ================= HELPER ================= */
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
