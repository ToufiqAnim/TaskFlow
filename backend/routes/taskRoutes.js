import express from "express";
import { TaskController } from "../controllers/taskControllers.js";
import { AuthMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Task Management Routes
router.get("/", AuthMiddleware.auth, TaskController.getAllTasks);
router.get("/:id", AuthMiddleware.auth, TaskController.getTaskById);
router.post(
  "/",
  AuthMiddleware.auth,
  AuthMiddleware.adminAuth,
  TaskController.createTask
);
router.put("/:id", AuthMiddleware.auth, TaskController.updateTask);
router.put("/:id/status", AuthMiddleware.auth, TaskController.updateTaskStatus);
router.put(
  "/:id/todo",
  AuthMiddleware.auth,
  TaskController.updateTaskChecklist
);

router.delete(
  "/:id",
  AuthMiddleware.auth,
  AuthMiddleware.adminAuth,
  TaskController.deleteTask
);

//Dashboard Data routes
router.get(
  "/dashboard-data",
  AuthMiddleware.auth,
  TaskController.getDashboardData
);
router.get(
  "/user-dashboard-data",
  AuthMiddleware.auth,
  TaskController.getUserDashboardData
);

export default router;
