import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { AuthServices } from "../services/authServices.js";

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "10d" });
};
const signupUser = async (req, res) => {
  try {
    const userData = await AuthServices.signupUser(req.body);
    res.status(200).json(userData);
  } catch (error) {
    res.status(500).json({ message: "Signup failed", error: error.message });
  }
};
const loginUser = async (req, res) => {
  try {
    const userData = await AuthServices.loginUser(req.body);
    res.status(200).json(userData);
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};
const getuserProfile = async (req, res) => {};
const updateuserProfile = async (req, res) => {};

export const AuthController = {
  signupUser,
  loginUser,
  getuserProfile,
  updateuserProfile,
};
