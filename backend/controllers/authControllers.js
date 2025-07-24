import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "10d" });
};
const signupUser = async (req, res) => {};
const loginUser = async (req, res) => {};
const getuserProfile = async (req, res) => {};
const updateuserProfile = async (req, res) => {};

export const AuthController = {
  signupUser,
  loginUser,
  getuserProfile,
  updateuserProfile,
};
