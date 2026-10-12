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
import { requestIdMiddleware } from "@presentation/middlewares/request-id.middleware";

dotenv.config();

const app = express();
const allowedOrigins = new Set(
  (process.env.CLIENT_ORIGINS ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)
);

app.disable("x-powered-by");
app.set("trust proxy", process.env.TRUST_PROXY === "true" ? 1 : false);
app.use(helmet());
app.use(requestIdMiddleware);
app.use("/api", rateLimiter);
app.use(ReqLogService.streamLog());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.has(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error("Origin not allowed by CORS"));
    },
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
app.use(express.json({ limit: "10mb", strict: true }));
app.use(cookieParser());
app.use("/api", apiRoutes);
app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
