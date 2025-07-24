import e from "express";
import express from "express";
import { AuthController } from "../controllers/authControllers";

const router = express.Router();

//Routes
router.post("/signup", AuthController.signupUser);
router.post("/login", AuthController.loginUser);
router.get("/profile", protect, AuthController.getuserProfile);
router.put("/profile", protect, AuthController.updateuserProfile);

export default router;
