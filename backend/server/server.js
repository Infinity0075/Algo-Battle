const express = require("express");
const cors = require("cors");
require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");

const { protect } = require("./middleware/authMiddleware");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const submissionRoutes = require("./routes/submissionRoutes");
const userRoutes = require("./routes/userRoutes");
const problemRoutes = require("./routes/problemRoutes");

const app = express();

// Connect DB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/users", userRoutes);
app.use("/api/problems", problemRoutes);

// Basic route
app.get("/", (req, res) => {
  res.send("API running...");
});

app.get("/api/protected", protect, (req, res) => {
  res.json({
    message: "You accessed protected route 🔐",
    user: req.user,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: err.message || "Server Error" });
});

const PORT = process.env.PORT || 5005;

/* 🔥 SOCKET SETUP */
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

let rooms = {};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join_room", ({ roomId, username }) => {
    socket.join(roomId);

    socket.roomId = roomId;
    socket.username = username;

    if (!rooms[roomId]) {
      rooms[roomId] = {
        users: [],
        host: socket.id,
        started: false,
        leaderboard: [],
      };
    }

    rooms[roomId].users.push({
      id: socket.id,
      username,
    });

    io.to(roomId).emit("room_data", rooms[roomId]);
  });

  socket.on("start_battle", () => {
    const room = rooms[socket.roomId];
    if (!room || socket.id !== room.host) return;

    room.started = true;
    room.startTime = Date.now();

    io.to(socket.roomId).emit("battle_started", {
      startTime: room.startTime,
    });
  });

  socket.on("code_change", ({ code }) => {
    socket.to(socket.roomId).emit("code_update", code);
  });

  socket.on("submit_code", ({ code }) => {
    const room = rooms[socket.roomId];
    if (!room) return;

    const result = {
      username: socket.username,
      status: Math.random() > 0.5 ? "Accepted" : "Wrong Answer",
      time: Date.now() - room.startTime,
    };

    if (result.status === "Accepted") {
      room.leaderboard.push(result);
      room.leaderboard.sort((a, b) => a.time - b.time);
    }

    io.to(socket.roomId).emit("leaderboard_update", room.leaderboard);
    io.to(socket.roomId).emit("submission_result", result);
  });

  socket.on("disconnect", () => {
    const roomId = socket.roomId;
    if (!roomId || !rooms[roomId]) return;

    rooms[roomId].users = rooms[roomId].users.filter((u) => u.id !== socket.id);

    if (rooms[roomId].host === socket.id) {
      rooms[roomId].host = rooms[roomId].users[0]?.id;
    }

    io.to(roomId).emit("room_data", rooms[roomId]);
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
