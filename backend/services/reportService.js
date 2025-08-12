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
  const users = await User.find().select("name email _id").lean();
  const userTask = await Task.find().populate("assignedTo", "name email _id");
  const userTaskMap = {};
  users.forEach((user) => {
userTaskMap[user._id]={
  name:user.name,
  email:user.email,
taskCount:0,
completedTaskCount:0,
inProgressTaskCount:0,
pendingTaskCount:0,
};
};
  
}
};

export const ReportService = { exportTasksReport };
