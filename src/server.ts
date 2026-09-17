import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import { Request, Response } from "express";
import rateLimiter from "@presentation/middlewares/ratelimit.middleware";
import { notFoundMiddleware } from "@presentation/middlewares/notfound.middleware";
import { ReqLogService, webhookController } from "@di/container-resolver";
import { errorMiddleware } from "@presentation/middlewares/error.middleware";
import apiRoutes from "@presentation/routes/test/api.routes";
import { asyncHandler } from "@shared/utils/async-handler";

dotenv.config();

const app = express();
const allowedOrigins = process.env.CLIENT_ORIGINS;

app.use(helmet());
app.use("/api", rateLimiter);
app.use(ReqLogService.streamLog());
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "message send from server" });
});
app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  asyncHandler(webhookController.handle.bind(webhookController))
);
app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());
app.use("/api", apiRoutes);
app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
