const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { protect } = require("./middleware/authMiddleware");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");

const submissionRoutes = require("./routes/submissionRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

// Connect DB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/submissions", submissionRoutes);
app.use("/api/users", userRoutes);
// Test route
app.get("/", (req, res) => {
  res.send("API running...");
});
app.get("/api/protected", protect, (req, res) => {
  res.json({
    message: "You accessed protected route 🔐",
    user: req.user,
  });
});

const PORT = process.env.PORT || 5005;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
