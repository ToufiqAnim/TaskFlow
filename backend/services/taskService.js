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
const getAllTasks = () => {};
const getTaskById = () => {};
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
