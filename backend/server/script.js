// const express = require("express");
// const cors = require("cors");
// require("dotenv").config();
// const http = require("http");
// const { Server } = require("socket.io");

// const connectDB = require("./config/db");
// const authRoutes = require("./routes/authRoutes");
// const submissionRoutes = require("./routes/submissionRoutes");
// const userRoutes = require("./routes/userRoutes");
// const problemRoutes = require("./routes/problemRoutes");
// const Problem = require("./models/Problem");
// const judgeRoutes = require("./routes/judgeRoutes");

// const app = express();

// // 🔧 DB
// connectDB();

// // 🔥 FIXED CORS (IMPORTANT)
// const FRONTEND_URL = "http://localhost:5173";

// app.use(
//   cors({
//     origin: FRONTEND_URL,
//     credentials: true,
//   }),
// );

// app.use(express.json());

// // 🔧 Health check
// app.get("/", (req, res) => res.send("API running..."));

// // 🔧 Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/submissions", submissionRoutes);
// app.use("/api/users", userRoutes);
// app.use("/api/problems", problemRoutes);
// app.use("/api/judge", judgeRoutes);

// // 🔧 HTTP + SOCKET SERVER
// const server = http.createServer(app);

// // 🔥 FIX SOCKET CORS ALSO
// const io = new Server(server, {
//   cors: {
//     origin: FRONTEND_URL,
//     methods: ["GET", "POST"],
//     credentials: true,
//   },
// });

// // 🔧 In-memory store
// const rooms = new Map();

// io.on("connection", (socket) => {
//   console.log("User connected:", socket.id);

//   socket.on("join_room", ({ roomId, username }) => {
//     if (!roomId || !username) return;

//     socket.join(roomId);
//     socket.roomId = roomId;
//     socket.username = username;

//     if (!rooms.has(roomId)) {
//       rooms.set(roomId, {
//         users: [],
//         host: socket.id,
//         started: false,
//         leaderboard: [],
//       });
//     }

//     const room = rooms.get(roomId);

//     if (!room.users.find((u) => u.id === socket.id)) {
//       room.users.push({ id: socket.id, username });
//     }

//     io.to(roomId).emit("room_data", room);
//   });

//   socket.on("start_battle", async () => {
//     try {
//       const room = rooms.get(socket.roomId);
//       if (!room || socket.id !== room.host) return;

//       const count = await Problem.countDocuments();
//       if (count === 0) return;

//       const randomIndex = Math.floor(Math.random() * count);
//       const random = await Problem.findOne().skip(randomIndex);

//       room.problem = random;
//       room.problemId = random._id;
//       room.startTime = Date.now();
//       room.started = true;

//       io.to(socket.roomId).emit("battle_started", {
//         startTime: room.startTime,
//         problem: random,
//       });
//     } catch (err) {
//       console.error("start_battle error:", err.message);
//     }
//   });

//   socket.on("code_change", ({ code }) => {
//     if (!socket.roomId) return;
//     socket.to(socket.roomId).emit("code_update", code);
//   });

//   socket.on("submit_code", () => {
//     const room = rooms.get(socket.roomId);
//     if (!room || !room.started) return;

//     const result = {
//       username: socket.username,
//       status: "Accepted",
//       time: Date.now() - room.startTime,
//     };

//     room.leaderboard.push(result);
//     room.leaderboard.sort((a, b) => a.time - b.time);

//     io.to(socket.roomId).emit("submission_result", result);
//   });

//   socket.on("disconnect", () => {
//     const roomId = socket.roomId;
//     if (!roomId || !rooms.has(roomId)) return;

//     const room = rooms.get(roomId);

//     room.users = room.users.filter((u) => u.id !== socket.id);

//     if (room.host === socket.id) {
//       room.host = room.users[0]?.id || null;
//     }

//     if (room.users.length === 0) {
//       rooms.delete(roomId);
//       return;
//     }

//     io.to(roomId).emit("room_data", room);
//   });
// });

// process.on("unhandledRejection", (err) => {
//   console.error("Unhandled Rejection:", err.message);
// });

// const PORT = process.env.PORT || 5005;
// server.listen(PORT, () => console.log(`🚀 Server running on ${PORT}`));

/**
 * ============================================
 * 🚀 SERVER ENTRY (script.js)
 * ============================================
 *
 * 📌 What this file does:
 * 1. Setup Express server
 * 2. Connect MongoDB
 * 3. Apply security middlewares
 * 4. Setup routes
 * 5. Setup Socket.IO (real-time battle)
 * 6. Start server
 *
 * 🔁 Flow:
 * Request → Middleware → Routes → Controller → DB → Response
 */

const express = require("express");
const cors = require("cors");
require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");

/** 🔐 Security */
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

/** 📦 DB */
const connectDB = require("./config/db");

/** 📦 Routes */
const authRoutes = require("./routes/authRoutes");
const submissionRoutes = require("./routes/submissionRoutes");
const userRoutes = require("./routes/userRoutes");
const problemRoutes = require("./routes/problemRoutes");
const judgeRoutes = require("./routes/judgeRoutes");

/** 📦 Models */
const Problem = require("./models/Problem");

/** 📦 Services */
const { runCode } = require("./services/judgeService");

/** ============================================
 * 🔧 APP INIT
 * ============================================ */
const app = express();

/** ============================================
 * 🧠 STEP 1: CONNECT DATABASE
 * ============================================ */
connectDB();

/** ============================================
 * 🔐 STEP 2: SECURITY MIDDLEWARES
 * ============================================ */

// Helmet → secure headers
app.use(helmet());

// Rate limit → prevent spam
app.use(
  rateLimit({
    windowMs: 60 * 1000, // 1 min
    max: 100, // max 100 req/min
  }),
);

/** ============================================
 * 🌐 STEP 3: CORS CONFIG
 * ============================================ */
const FRONTEND_URL = "http://localhost:5173";

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  }),
);

/** ============================================
 * 📦 STEP 4: BODY PARSER
 * ============================================ */
app.use(express.json());

/** ============================================
 * ❤️ STEP 5: HEALTH CHECK
 * ============================================ */
app.get("/", (req, res) => {
  res.send("API running...");
});

// all routes:-
app.use("/api/auth", authRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/users", userRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/judge", judgeRoutes);

// socket setups..
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: FRONTEND_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

/**
 * 🧠 In-memory room store
 * ⚠️ Not persistent (resets on server restart)
 */
const rooms = new Map();

/**
 * 🔌 SOCKET EVENTS
 */
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  /**
   * 👥 JOIN ROOM
   */
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

    // Avoid duplicate users
    if (!room.users.find((u) => u.id === socket.id)) {
      room.users.push({ id: socket.id, username });
    }

    io.to(roomId).emit("room_data", room);
  });

  /**
   *  START BATTLE
   */
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

  /**
   * 💻 LIVE CODE SYNC
   */
  socket.on("code_change", ({ code }) => {
    if (!socket.roomId) return;
    socket.to(socket.roomId).emit("code_update", code);
  });

  /**
   *  SUBMIT CODE (REAL JUDGE)
   */
  socket.on("submit_code", async ({ code, problemId }) => {
    try {
      const room = rooms.get(socket.roomId);
      if (!room || !room.started) return;

      const result = await runCode({ code, problemId });

      // ✅ Only accepted goes to leaderboard
      if (result.status === "Accepted") {
        const entry = {
          username: socket.username,
          time: Date.now() - room.startTime,
        };

        room.leaderboard.push(entry);
        room.leaderboard.sort((a, b) => a.time - b.time);

        io.to(socket.roomId).emit("leaderboard_update", room.leaderboard);
      }

      socket.emit("submission_result", result);
    } catch (err) {
      console.error("submit_code error:", err.message);
    }
  });

  /**
   *  DISCONNECT
   */
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

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
