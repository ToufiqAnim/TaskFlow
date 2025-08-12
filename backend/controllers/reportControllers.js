import { ReportService } from "../services/reportService.js";

const exportTasksReport = async (req, res) => {
  try {
    const workBook = await ReportService.exportTasksReport();

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=task-report.xlsx"
    );
    await workBook.xlsx.write(res);
    res.end();
  } catch (error) {
    res
      .status(500)
      .json({ message: " Error exportiong task", error: error.message });
  }
};
const exportUsersReport = async (req, res) => {
  try {
    const workBook = await ReportService.exportUsersReport();

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=user-report.xlsx"
    );

    await workBook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Error exporting users report:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
export const ReportController = { exportTasksReport, exportUsersReport };
