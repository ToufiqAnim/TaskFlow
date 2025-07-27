import express from "express";
import { AuthController } from "../controllers/authControllers.js";
import { AuthMiddleware } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/imgUploadMiddleware.js";

const router = express.Router();

//Routes
router.post("/signup", AuthController.signupUser);
router.post("/login", AuthController.loginUser);
router.get("/profile", AuthMiddleware.auth, AuthController.getuserProfile);
router.put("/profile", AuthMiddleware.auth, AuthController.updateuserProfile);

router.post("/upload-image", upload.single("image"), (req, res) => {
  if (!req.file) {
    console.log("No file uploaded");
    return res.status(400).send("No file uploaded");
  }
  const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${
    req.file.filename
  }`;
  res.status(200).send({ imageUrl });
});

export default router;
