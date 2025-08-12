import Task from "../models/Tasks.js";
import excelJS from "exceljs";
import User from "../models/User.js";
const exportTasksReport = async () => {
  const tasks = await Task.find().populate(
    "assignedTo",
    "name email profileImageUrl"
  );
  const workBook = new excelJS.Workbook();
  const workSheet = workBook.addWorksheet("Task Report");
  workSheet.columns = [
    { header: "Task ID", key: "title", width: 25 },
    { header: "Title", key: "title", width: 30 },
    { header: "Description", key: "description", width: 50 },
    { header: "Assigned To", key: "assignedTo.name", width: 30 },
    { header: "Due Date", key: "dueDate", width: 30 },
    { header: "Priority", key: "priority", width: 15 },
    { header: "Status", key: "status", width: 20 },
  ];
  tasks.forEach((task) => {
    const assignedTo = Array.isArray(task.assignedTo)
      ? task.assignedTo.map((user) => `${user.name} - ${user.email}`).join(", ")
      : task.assignedTo
      ? `${task.assignedTo.name} - ${task.assignedTo.email}`
      : "Unassigned";

    workSheet.addRow({
      _id: task._id.toString(),
      title: task.title,
      description: task.description,
      assignedTo,
      dueDate: task.dueDate ? task.dueDate.toISOString().split("T")[0] : "N/A",
      priority: task.priority,
      status: task.status,
    });
  });
  return workBook;
};
const exportUsersReport = async () => {
  // 1️⃣ Get all users
  const users = await User.find().select("name email _id").lean();

  // 2️⃣ Prepare a task stats map for each user
  const userTaskMap = Object.fromEntries(
    users.map((user) => [
      user._id,
      {
        name: user.name,
        email: user.email,
        taskCount: 0,
        completedTasks: 0,
        inProgressTasks: 0,
        pendingTasks: 0,
      },
    ])
  );

  // 3️⃣ Get all tasks with assigned users
  const userTasks = await Task.find()
    .populate("assignedTo", "name email _id")
    .lean();

  // 4️⃣ Fill in task stats
  userTasks.forEach((task) => {
    const assignedUser = task.assignedTo;
    if (assignedUser && userTaskMap[assignedUser._id]) {
      const stats = userTaskMap[assignedUser._id];
      stats.taskCount++;

      switch (task.status) {
        case "Completed":
          stats.completedTasks++;
          break;
        case "In Progress":
          stats.inProgressTasks++;
          break;
        case "Pending":
          stats.pendingTasks++;
          break;
      }
    }
  });

  // 5️⃣ Create Excel workbook
  const workBook = new excelJS.Workbook();
  const workSheet = workBook.addWorksheet("User Report");

  workSheet.columns = [
    { header: "Name", key: "name", width: 30 },
    { header: "Email", key: "email", width: 50 },
    { header: "Total Assigned Task", key: "taskCount", width: 20 },
    { header: "Completed Task", key: "completedTasks", width: 20 },
    { header: "In Progress Task", key: "inProgressTasks", width: 20 },
    { header: "Pending Task", key: "pendingTasks", width: 20 },
  ];

  // 6️⃣ Add user rows
  Object.values(userTaskMap).forEach((user) => workSheet.addRow(user));

  return workBook;
};

export const ReportService = { exportTasksReport, exportUsersReport };
