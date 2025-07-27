import Task from "../models/Tasks.js";

const createTask = async ({
  title,
  description,
  assignedTo,
  dueDate,
  priority,
  attachments,
  todoCheckList,
}) => {
  const task = await Task.create({
    title,
    description,
    assignedTo,
    dueDate,
    priority,
    attachments,
    todoCheckList,
  });
  return task;
};
const getAllTasks = async () => {
  const task = await Task.find()
    .populate("assignedTo", "-password")
    .populate("createdBy", "name email")
    .sort({ createdAt: -1 });
  return task;
};
const getTaskById = async (taskId) => {
  const task = await Task.findById(taskId);
  if (!task) {
    throw new Error("User not found");
  }
  return task;
};
const updateTask = () => {};
const deleteTask = () => {};
const getDashboardData = () => {};
const getUserDashboardData = () => {};
const updateTaskStatus = () => {};
const updateTaskChecklist = () => {};

export const TaskService = {
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
