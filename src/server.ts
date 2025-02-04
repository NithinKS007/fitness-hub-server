import express from "express";
import authRoutes from "./interfaces/routes/authRoutes";
import cookieParser from "cookie-parser";
const app = express();




app.use(express.json({ limit: '10mb' }));
app.use(cookieParser())
app.use("/api/v1/auth",authRoutes)

export default app;
