import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "10d" });
};
const signupUser = async (req, res) => {
  try {
    const { name, email, password, profileImageUrl, adminInviteToken } =
      req.body;
    const existingUser = await User.findOne({ email });
    if (existinguser) {
      return res.status(400).json({ message: "User already exists" });
    }
    let role = "member";
    if (
      adminInviteToken &&
      adminInviteToken === process.env.ADMIN_INVITE_TOKEN
    ) {
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
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profileImageUrl: user.profileImageUrl,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: "Signup failed", error: error.message });
  }
};
const loginUser = async (req, res) => {};
const getuserProfile = async (req, res) => {};
const updateuserProfile = async (req, res) => {};

export const AuthController = {
  signupUser,
  loginUser,
  getuserProfile,
  updateuserProfile,
};
