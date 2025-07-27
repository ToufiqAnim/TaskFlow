import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "10d" });
};

const signupUser = async ({
  name,
  email,
  password,
  profileImageUrl,
  adminInviteToken,
}) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("User already exists");
  }
  let role = "member";
  if (adminInviteToken && adminInviteToken == process.env.ADMIN_INVITE_TOKEN) {
    role = "admin";
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    profileImageUrl,
    role,
  });
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    profileImageUrl: user.profileImageUrl,
    role: user.role,
    token: generateToken(user._id),
  };
};
const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("User not found");
  }
  const isPasswordMatched = await bcrypt.compare(password, user.password);
  if (!isPasswordMatched) {
    throw new Error("Invalid password");
  }
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    profileImageUrl: user.profileImageUrl,
    role: user.role,
    token: generateToken(user._id),
  };
};
const getUserProfile = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};
const updateUserProfile = async (userId, updateData) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  // Update fields based on updateData
  user.name = updateData.name || user.name;
  user.email = updateData.email || user.email;

  if (updateData.password) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(updateData.password, salt);
  }
  const upateUser = await user.save();
  return {
    _id: upateUser._id,
    name: upateUser.name,
    email: upateUser.email,
    profileImageUrl: upateUser.profileImageUrl,
    role: upateUser.role,
    token: generateToken(upateUser._id),
  };
};

export const AuthServices = {
  signupUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
};
