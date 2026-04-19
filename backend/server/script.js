const express = require("express");
const cors = require("cors");
require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const submissionRoutes = require("./routes/submissionRoutes");
const userRoutes = require("./routes/userRoutes");
const problemRoutes = require("./routes/problemRoutes");
const Problem = require("./models/Problem");
const judgeRoutes = require("./routes/judgeRoutes");

const app = express();

// 🔧 DB
connectDB();

// 🔥 FIXED CORS (IMPORTANT)
const FRONTEND_URL = "http://localhost:5173";

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  }),
);

app.use(express.json());

// 🔧 Health check
app.get("/", (req, res) => res.send("API running..."));

// 🔧 Routes
app.use("/api/auth", authRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/users", userRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/judge", judgeRoutes);

// 🔧 HTTP + SOCKET SERVER
const server = http.createServer(app);

// 🔥 FIX SOCKET CORS ALSO
const io = new Server(server, {
  cors: {
    origin: FRONTEND_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// 🔧 In-memory store
const rooms = new Map();

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

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
      });
    }

    const room = rooms.get(roomId);

    if (!room.users.find((u) => u.id === socket.id)) {
      room.users.push({ id: socket.id, username });
    }

    io.to(roomId).emit("room_data", room);
  });

  socket.on("start_battle", async () => {
    try {
      const room = rooms.get(socket.roomId);
      if (!room || socket.id !== room.host) return;

      const count = await Problem.countDocuments();
      if (count === 0) return;

      const randomIndex = Math.floor(Math.random() * count);
      const random = await Problem.findOne().skip(randomIndex);

      room.problem = random;
      room.problemId = random._id;
      room.startTime = Date.now();
      room.started = true;

      io.to(socket.roomId).emit("battle_started", {
        startTime: room.startTime,
        problem: random,
      });
    } catch (err) {
      console.error("start_battle error:", err.message);
    }
  });

  socket.on("code_change", ({ code }) => {
    if (!socket.roomId) return;
    socket.to(socket.roomId).emit("code_update", code);
  });

  socket.on("submit_code", () => {
    const room = rooms.get(socket.roomId);
    if (!room || !room.started) return;

    const result = {
      username: socket.username,
      status: "Accepted",
      time: Date.now() - room.startTime,
    };

    room.leaderboard.push(result);
    room.leaderboard.sort((a, b) => a.time - b.time);

    io.to(socket.roomId).emit("submission_result", result);
  });

  socket.on("disconnect", () => {
    const roomId = socket.roomId;
    if (!roomId || !rooms.has(roomId)) return;

    const room = rooms.get(roomId);

    room.users = room.users.filter((u) => u.id !== socket.id);

    if (room.host === socket.id) {
      room.host = room.users[0]?.id || null;
    }

    if (room.users.length === 0) {
      rooms.delete(roomId);
      return;
    }

    io.to(roomId).emit("room_data", room);
  });
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err.message);
});

const PORT = process.env.PORT || 5005;
server.listen(PORT, () => console.log(`🚀 Server running on ${PORT}`));
