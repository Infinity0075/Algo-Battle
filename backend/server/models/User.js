const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 20,
      unique: true,
      index: true, // 🔧 ADDED: faster queries
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true, // 🔧 ADDED
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email"], // 🔧 ADDED validation
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false, // 🔧 IMPORTANT: hide by default
    },
    rating: {
      type: Number,
      default: 1000,
      min: 0, // 🔧 ADDED safety
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true,
  },
);

// 🔥 HASH PASSWORD BEFORE SAVE
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// 🔥 COMPARE PASSWORD (LOGIN)
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// 🔥 REMOVE PASSWORD FROM RESPONSE
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model("User", userSchema);
