import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import path from "path";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
connectDB();
app.use(express.json());

app.use("/api/auth", authRoutes);
// app.use("/api/admin", require("./routes/adminRoutes.js"));
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Route is working");
});
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
