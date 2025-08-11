export { ReportService } from "../services/reportService.js";
const exportTasksReport = async (req, res) => {
  try {
    const workBook = await ReportService.exportTasksReport();
    res.status(200).json(data);
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
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
export const ReportController = { exportTasksReport, exportUsersReport };
