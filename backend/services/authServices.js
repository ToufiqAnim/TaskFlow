import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "10d" });
};

const signup = async ({
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
  let role = "admin";
  if (adminInviteToken && adminInviteToken == process.env.ADMIN_INVITE_TOKEN) {
    role = "admin";
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const user = User.create({
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
export const AuthServices = { signup };
