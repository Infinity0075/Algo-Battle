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
const Problem = require("./models/problemModel/Problem"); // ✅ IMPORTANT

const app = express();

// DB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/users", userRoutes);
app.use("/api/problems", problemRoutes);

app.get("/", (req, res) => res.send("API running..."));

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});

let rooms = {};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // 🔥 JOIN ROOM
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

  // 🔥 START BATTLE
  socket.on("start_battle", async () => {
    const room = rooms[socket.roomId];
    if (!room || socket.id !== room.host) return;

    const problems = await Problem.find();
    const random = problems[Math.floor(Math.random() * problems.length)];

    room.problem = random;
    room.problemId = random._id;
    room.startTime = Date.now();

    io.to(socket.roomId).emit("battle_started", {
      startTime: room.startTime,
      problem: random,
    });
  });

  // 🔥 CODE SYNC
  socket.on("code_change", ({ code }) => {
    socket.to(socket.roomId).emit("code_update", code);
  });

  // 🔥 SUBMIT
  socket.on("submit_code", ({ code }) => {
    const room = rooms[socket.roomId];
    if (!room) return;

    const result = {
      username: socket.username,
      status: "Accepted",
      time: Date.now() - room.startTime,
    };

    room.leaderboard.push(result);

    io.to(socket.roomId).emit("submission_result", result);
  });

  // 🔥 DISCONNECT
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

const PORT = process.env.PORT || 5005;
server.listen(PORT, () => console.log(`🚀 Server running on ${PORT}`));
