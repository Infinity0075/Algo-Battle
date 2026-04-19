const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // 🔧 ADDED: better defaults for production
      autoIndex: false, // disable in prod for performance
      serverSelectionTimeoutMS: 5000, // fail fast
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`); // 🔧 CHANGED: better log
  } catch (error) {
    console.error("DB Error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
