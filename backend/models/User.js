import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    profileImageUrl: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: ["admin", "member"],
      default: "member",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
