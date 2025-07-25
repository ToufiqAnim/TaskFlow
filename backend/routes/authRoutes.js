import e from "express";
import express from "express";
import { AuthController } from "../controllers/authControllers";
import { AuthMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

//Routes
router.post("/signup", AuthController.signupUser);
router.post("/login", AuthController.loginUser);
router.get("/profile", AuthMiddleware.auth, AuthController.getuserProfile);
router.put("/profile", AuthMiddleware.auth, AuthController.updateuserProfile);

export default router;
