import express from "express";
import authRoutes from "./interfaces/routes/authRoutes";
import adminRoutes from "./interfaces/routes/adminRoutes";
import cookieParser from "cookie-parser";
import cors from "cors";
import trainerRoutes from "./interfaces/routes/trainerRoutes";
import { errorMiddleware } from "./interfaces/middlewares/errorMiddleWare";
import userRoutes from "./interfaces/routes/userRoutes";
import { SubscriptionController } from "./interfaces/controllers/subscriptionController";
import chatRoutes from "./interfaces/routes/chatRoutes";
import dotenv from "dotenv";
import { Request,Response } from "express";
dotenv.config();

const app = express();
const allowedOrigins = process.env.CLIENT_ORIGINS;

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
)
app.post(
  "/api/v1/webhook",
  express.raw({ type: "application/json" }),
  SubscriptionController.webHookHandler
);
app.get("/",(req:Request,res:Response)=>{
   res.json({message:"message send from server"})
})
app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/trainer", trainerRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/chat", chatRoutes);
app.use(errorMiddleware);

export default app;
