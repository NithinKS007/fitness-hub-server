import express from "express";
import authRoutes from "@presentation/routes/auth.routes";
import adminRoutes from "@presentation/routes/admin.routes";
import cookieParser from "cookie-parser";
import cors from "cors";
import trainerRoutes from "@presentation/routes/trainer.routes";
import { errorMiddleware } from "@presentation/middlewares/error.middleware";
import userRoutes from "@presentation/routes/user.routes";
import chatRoutes from "@presentation/routes/chat.routes";
import dotenv from "dotenv";
import { Request, Response } from "express";
import morganMiddleware from "@infrastructure/services/logging/morgan";
import rateLimiter from "@presentation/middlewares/ratelimit.middleware";
import { notFoundMiddleware } from "@presentation/middlewares/notfound.middleware";
import { asyncHandler } from "@shared/utils/async-handler";
import { webhookController } from "@di/container-resolver";
import publicRoutes from "@presentation/routes/public.routes";
import cloudinaryRoutes from "@presentation/routes/cloudinary.routes";
import helmet from "helmet";
import zegocloudRoutes from "@presentation/routes/zegocloud.routes";

dotenv.config();

const app = express();
const allowedOrigins = process.env.CLIENT_ORIGINS;

app.use(helmet());
app.use("/api", rateLimiter);
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
  asyncHandler(webhookController.handle.bind(webhookController))
);
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "message send from server" });
});
app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());
app.use("/api/v1/public", publicRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/trainer", trainerRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/chat", chatRoutes);
app.use("/api/v1/cloudinary", cloudinaryRoutes);
app.use("/api/v1/zegocloud",zegocloudRoutes)
app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
