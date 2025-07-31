import Task from "../models/Tasks.js";
import { TaskService } from "../services/taskService.js";

const getDashboardData = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
const getUserDashboardData = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      assignedTo,
      dueDate,
      priority,
      attachments,
      todoCheckList,
      status,
    } = req.body;
    if (!Array.isArray(assignedTo)) {
      return res
        .status(400)
        .json({ message: "assignedTo must be an array of Users IDs" });
    }
    const task = await TaskService.createTask({
      title,
      description,
      assignedTo,
      dueDate,
      priority,
      attachments,
      todoCheckList,
      createdBy: req.user._id,
      status,
    });
    res.status(201).json({
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
const getAllTasks = async (req, res) => {
  try {
    const data = await TaskService.getAllTasks(req.user, req.query);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
const getTaskById = async (req, res) => {
  try {
    const task = await TaskService.getTaskById(req.params.id);
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const updatedTask = await TaskService.updateTask(req.params.id, req.body);
    res.json({ message: "Task updated successfully", updatedTask });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
export const updateTaskStatus = async (req, res) => {
  try {
    const task = await TaskService.updateTaskStatus(
      req.params.id,
      req.user,
      req.body.status
    );
    res.json({ message: "Task status updated", task });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
/* const updateTaskStatus = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const isAssigned = task.assignedTo.some(
      (userId) => userId.toString() === req.user._id.toString()
    );

    if (!isAssigned && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    task.status = req.body.status || task.status;

    if (task.status === "Completed") {
      task.todoChecklist.forEach((item) => (item.completed = true));
      task.progress = 100;
    }

    await task.save();
    res.json({ message: "Task status updated", task });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}; */

const updateTaskChecklist = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
const deleteTask = async (req, res) => {
  try {
    const deletedTask = await TaskService.deleteTask(req.params.id);
    res.status(200).json({
      message: "Task deleted successfully",
      deletedTask,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
export const TaskController = {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getDashboardData,
  getUserDashboardData,
  updateTaskStatus,
  updateTaskChecklist,
};
