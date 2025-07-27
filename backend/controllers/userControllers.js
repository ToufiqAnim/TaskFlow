import { UserServices } from "../services/userService.js";

const getAllUsers = async (req, res) => {
  try {
    const users = await UserServices.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
const getUserById = async (req, res) => {
  try {
    const user = await UserServices.getUserById(req.params.id);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
const deleteUser = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const UserController = { getAllUsers, getUserById, deleteUser };
