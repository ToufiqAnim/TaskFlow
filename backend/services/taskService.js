import Task from "../models/Tasks.js";

const createTask = async ({
  title,
  description,
  assignedTo,
  dueDate,
  priority,
  attachments,
  todoCheckList,
  status,
  createdBy,
}) => {
  const task = await Task.create({
    title,
    description,
    assignedTo,
    dueDate,
    priority,
    attachments,
    todoCheckList,
    status,
    createdBy,
  });
  return task;
};
const getAllTasks = async (user, query) => {
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
      const completedTodoCount = task.todoCheckList.filter(
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
    todoCheckList,
  } = updateData;
  task.title = title ?? task.title;
  task.description = description ?? task.description;
  task.assignedTo = assignedTo ?? task.assignedTo;
  task.dueDate = dueDate ?? task.dueDate;
  task.priority = priority ?? task.priority;
  task.attachments = attachments ?? task.attachments;
  task.todoCheckList = todoCheckList ?? task.todoCheckList;
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
const deleteTask = async (taskId) => {
  const deletedTask = await Task.findByIdAndDelete(taskId);
  if (!deletedTask) {
    throw new Error("Task not found");
  }

  return deletedTask;
};

const getDashboardData = async () => {
  // Taks Count
  const [totalTask, pendingTask, completedTask, overDuetask] =
    await Promise.all([
      Task.countDocuments(),
      Task.countDocuments({ status: "Pending" }),
      Task.countDocuments({ status: "Completed" }),
      Task.countDocuments({ dueDate: { $lt: new Date() } }),
    ]);
  // Task Distribution By Status
  const taskStatus = ["Pending", "In Progress", "Completed"];
  const taskStatusCount = await Task.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);
  const taskDistribution = taskStatus.reduce((acc, status) => {
    const key = status.replace(/\s+/g, "");
    acc[key] = taskStatusCount.find((item) => item._id === status)?.count || 0;
    return acc;
  }, {});
  taskDistribution["All"] = totalTask;

  // Task Distribution By Priority
  const taskPriorities = ["Low", "Medium", "High"];
  const taskPriorityCount = await Task.aggregate([
    { $group: { _id: "$priority", count: { $sum: 1 } } },
  ]);
  const taskPriorityLevels = taskPriorities.reduce((acc, priority) => {
    acc[priority] =
      taskPriorityCount.find((item) => item._id === priority)?.count || 0;
    return acc;
  }, {});
  //fetch 10 recent task
  const recentTasks = await Task.find()
    .sort({ createdAt: -1 })
    .limit(10)
    .populate("assignedTo", "name email profileImageUrl");
  return {
    statics: {
      totalTask,
      pendingTask,
      completedTask,
      overDuetask,
    },
    charts: {
      taskDistribution,
      taskPriorityLevels,
    },
    recentTasks,
  };
};

const getUserDashboardData = () => {};
const updateTaskStatus = async (taskId, user, newStatus) => {
  const task = await Task.findById(taskId);
  if (!task) throw new Error("Task not found");

  const isAssigned = task.assignedTo.some(
    (userId) => userId.toString() === user._id.toString()
  );

  if (!isAssigned && user.role !== "admin") {
    throw new Error("Not authorized");
  }

  task.status = newStatus || task.status;

  if (task.status === "Completed") {
    task.todoCheckList.forEach((item) => (item.completed = true));
    task.progress = 100;
  }

  await task.save();
  return task;
};
const updateTaskChecklist = async (taskId, user, todoCheckList) => {
  const task = await Task.findById(taskId);
  if (!task) throw new Error("Task not found");

  const isAssigned = task.assignedTo.some(
    (userId) => userId.toString() === user._id.toString()
  );

  if (!isAssigned && user.role !== "admin") {
    throw new Error("Not authorized");
  }

  task.todoCheckList = todoCheckList;

  const completedCount = task.todoCheckList.filter(
    (item) => item.completed
  ).length;
  const totalItems = task.todoCheckList.length;

  task.progress =
    totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

  if (task.progress === 100) {
    task.status = "Completed";
  } else if (task.progress > 0) {
    task.status = "In Progress";
  } else {
    task.status = "Pending";
  }

  await task.save();

  const updatedTask = await Task.findById(taskId).populate(
    "assignedTo",
    "name email profileImageUrl"
  );

  return updatedTask;
};

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
