import express from "express";
import authRoutes from "./interfaces/routes/authRoutes";
import cookieParser from "cookie-parser";
import cors from "cors";
const app = express();

const allowedOrigins = process.env.CLIENT_ORIGINS;

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use("/api/v1/auth", authRoutes);

export default app;
