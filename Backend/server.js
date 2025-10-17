import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

// Routes
import authRoutes from "./routes/authRoutes.js";
import configRoutes from "./routes/configRoutes.js";
import wasteRequestRoutes from "./routes/wasteRequestRoutes.js";
import inquiryRoutes from "./routes/inquiryRoutes.js";
import announcementRoutes from "./routes/announcementRoutes.js";

dotenv.config();
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", // Allow requests from your frontend
    credentials: true,
  })
);
app.use(express.json());

// MongoDB connect
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error(err));

// Route Middleware
app.use("/api/auth", authRoutes);
app.use("/api/configs", configRoutes);
app.use("/api/requests", wasteRequestRoutes);
app.use("/api/inquiries", inquiryRoutes);
app.use("/api/announcements", announcementRoutes);

// Error handling middleware
import { errorHandler } from './middleware/errorHandler.js';
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
