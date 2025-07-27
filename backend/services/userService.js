import Task from "../models/Tasks.js";
import User from "../models/User.js";

const getAllUsers = async () => {
  const users = await User.find({ role: "member" }).select("-password");
  const UserWithTaskCount = await Promise.all(
    users.map(async (user) => {
      const pendingTask = await Task.countDocuments({
        assignedTo: user._id,
        status: "Pending",
      });
      const inProgressTask = await Task.countDocuments({
        assignedTo: user._id,
        status: "In Progress",
      });
      const completedTask = await Task.countDocuments({
        assignedTo: user._id,
        status: "Completed",
      });
      return { ...user._doc, pendingTask, inProgressTask, completedTask };
    })
  );
  return UserWithTaskCount;
};
const getUserById = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};
export const UserServices = { getAllUsers, getUserById };
