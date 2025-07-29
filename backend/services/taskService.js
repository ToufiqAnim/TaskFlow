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
export const getAllTasks = async (user, query) => {
  const {
    status,
    priority,
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    order = "desc",
  } = query;

  const filter = {};

  if (user.role !== "admin") {
    filter.assignedTo = user._id;
  }

  if (status) filter.status = status;
  if (priority) filter.priority = priority;

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const sortOrder = order === "asc" ? 1 : -1;
  const sort = sortBy === "priority" ? {} : { [sortBy]: sortOrder };

  // STEP 1: MongoDB fetch
  let tasks = await Task.find(filter)
    .populate("assignedTo", "name email profileImageUrl")
    .sort(sort)
    .skip(skip)
    .limit(parseInt(limit));

  // STEP 2: Priority sorting (manual override)
  if (sortBy === "priority") {
    const priorityMap = { High: 3, Medium: 2, Low: 1 };
    tasks.sort((a, b) => {
      const aVal = priorityMap[a.priority] || 0;
      const bVal = priorityMap[b.priority] || 0;
      return sortOrder === 1 ? aVal - bVal : bVal - aVal;
    });
  }

  // Checklist Count
  tasks = await Promise.all(
    tasks.map((task) => {
      const completedTodoCount = task.todoChecklist.filter(
        (item) => item.completed
      ).length;
      return { ...task._doc, completedTodoCount };
    })
  );

  // Status Summary
  const roleFilter = user.role === "admin" ? {} : { assignedTo: user._id };
  const [allTask, pendingTask, inProgressTask, completedTask, totalFiltered] =
    await Promise.all([
      Task.countDocuments(roleFilter),
      Task.countDocuments({ ...roleFilter, status: "Pending" }),
      Task.countDocuments({ ...roleFilter, status: "In Progress" }),
      Task.countDocuments({ ...roleFilter, status: "Completed" }),
      Task.countDocuments(filter),
    ]);

  return {
    task: tasks,
    statusSummary: {
      allTask,
      pendingTask,
      inProgressTask,
      completedTask,
    },
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      totalFiltered,
      totalPages: Math.ceil(totalFiltered / limit),
    },
  };
};
const getTaskById = async (taskId) => {
  const task = await Task.findById(taskId).populate(
    "assignedTo",
    "name email profileImageUrl"
  );
  if (!task) {
    throw new Error("User not found");
  }
  return task;
};
const updateTask = async (taskId, updateData) => {
  const task = await Task.findById(taskId).populate(
    "assignedTo",
    "name email profileImageUrl"
  );
  if (!task) {
    throw new Error("Task not found");
  }

  if (!task) {
    throw new Error("User not found");
  }
  const {
    title,
    description,
    assignedTo,
    dueDate,
    priority,
    attachments,
    todoChecklist,
  } = updateData;
  task.title = title ?? task.title;
  task.description = description ?? task.description;
  task.assignedTo = assignedTo ?? task.assignedTo;
  task.dueDate = dueDate ?? task.dueDate;
  task.priority = priority ?? task.priority;
  task.attachments = attachments ?? task.attachments;
  task.todoChecklist = todoChecklist ?? task.todoChecklist;
  if (assignedTo !== undefined) {
    if (!Array.isArray(assignedTo)) {
      const error = new Error("assignedTo must be an array of user IDs");
      error.statusCode = 400;
      throw error;
    }
    task.assignedTo = assignedTo;
  }

  const updatedTask = await task.save();
  return updatedTask;
};
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
