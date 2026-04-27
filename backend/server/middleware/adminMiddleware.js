// 🔥 IMPROVED: cleaner + production-safe

const adminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authorized" });
  }

  //  safer role check (avoid undefined crash)
  if (!req.user.role || req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access only" });
  }

  next();
};

module.exports = { adminOnly };
