const adminOnly = (req, res, next) => {
  try {
    // 🔐 check if user exists
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // 🔥 check role
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access only" });
    }

    next();
  } catch (err) {
    console.error("Admin middleware error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { adminOnly };
