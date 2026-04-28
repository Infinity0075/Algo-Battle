/**
 * ============================================
 * 👤 USER MODEL (CLEAN + SAFE)
 * ============================================
 */

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username required"],
      trim: true,
      minlength: 3,
      maxlength: 20,
      unique: true,
      index: true,
    },

    email: {
      type: String,
      required: [true, "Email required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email"],
    },

    password: {
      type: String,
      required: [true, "Password required"],
      minlength: 6,
      select: false,
    },

    rating: {
      type: Number,
      default: 1000,
      min: 0,
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

/**
 * 🔐 HASH PASSWORD (FIXED)
 */
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

/**
 * 🔑 MATCH PASSWORD
 */
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

/**
 * 🔒 REMOVE PASSWORD FROM OUTPUT
 */
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model("User", userSchema);
