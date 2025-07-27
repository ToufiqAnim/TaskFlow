import express from "express";
import { AuthMiddleware } from "../middlewares/authMiddleware.js";
import { UserController } from "../controllers/userControllers.js";

const router = express.Router();

router.get(
  "/",
  AuthMiddleware.auth,
  AuthMiddleware.adminAuth,
  UserController.getAllUsers
);
router.get("/:id", AuthMiddleware.auth, UserController.getUserById);
router.delete(
  "/:id",
  AuthMiddleware.auth,
  AuthMiddleware.adminAuth,
  UserController.deleteUser
);

export default router;
