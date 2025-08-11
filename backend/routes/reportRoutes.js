import experess from "express";
import { AuthMiddleware } from "../middlewares/authMiddleware.js";
import { ReportController } from "../controllers/reportControllers.js";

const router = experess.Router();

router.get(
  "/export/tasks",
  AuthMiddleware.auth,
  AuthMiddleware.adminAuth,
  ReportController.exportTasksReport
);
router.get(
  "/export/users",
  AuthMiddleware.auth,
  AuthMiddleware.adminAuth,
  ReportController.exportUsersReport
);
export default router;
