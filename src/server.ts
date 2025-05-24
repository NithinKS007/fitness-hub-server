import express from "express";
import authRoutes from "./presentation/routes/authRoutes";
import adminRoutes from "./presentation/routes/adminRoutes";
import cookieParser from "cookie-parser";
import cors from "cors";
import trainerRoutes from "./presentation/routes/trainerRoutes";
import { errorMiddleware } from "./presentation/middlewares/errorMiddleWare";
import userRoutes from "./presentation/routes/userRoutes";
import chatRoutes from "./presentation/routes/chatRoutes";
import dotenv from "dotenv";
import { Request, Response } from "express";
import morganMiddleware from "./infrastructure/logging/morganMiddleware";
import { WebhookController } from "./presentation/controllers/subscription/webhookController";
import rateLimiter from "./presentation/middlewares/rateLimitMiddleware";
import { notFoundMiddleware } from "./presentation/middlewares/notFoundMiddleware";
import expressAsyncHandler from "express-async-handler";
dotenv.config();

const app = express();
const allowedOrigins = process.env.CLIENT_ORIGINS;
app.use("/api/v1", rateLimiter);
app.use(morganMiddleware);
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);
app.post(
  "/api/v1/webhook",
  express.raw({ type: "application/json" }),
  expressAsyncHandler(WebhookController.webHookHandler)
);
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "message send from server" });
});
app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/trainer", trainerRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/chat", chatRoutes);
app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
