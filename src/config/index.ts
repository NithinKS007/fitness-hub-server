import dotenv from "dotenv";
import app from "@server";
import { socketService } from "@infrastructure/services/socket/socket.service";
import { createServer } from "http";
import "reflect-metadata";
import { socketConfig } from "@infrastructure/config/socket.config";
import { connectDB } from "@di/container-resolver";
import { ReqLogService } from "@di/container-resolver";
import {
  connectRedis,
  disconnectRedis,
} from "@infrastructure/config/redis.config";
dotenv.config();

export const startServer = async () => {
  let shuttingDown = false;
  try {

    await connectRedis();
    await connectDB.connectMongo();
    const httpServer = createServer(app);
    const io = await socketConfig(httpServer);
    await socketService(io);

    const PORT = process.env.PORT;
    const shutdown = async (signal: string) => {
      if (shuttingDown) return;
      shuttingDown = true;
      ReqLogService.log(`shutdown requested: ${signal}`);
      io.close();
      await new Promise<void>((resolve) => httpServer.close(() => resolve()));
      await connectDB.disconnectMongo();
      await disconnectRedis();
      process.exit(0);
    };

    process.once("SIGTERM", () => void shutdown("SIGTERM"));
    process.once("SIGINT", () => void shutdown("SIGINT"));
    process.on("unhandledRejection", (reason) => {
      ReqLogService.error("unhandled promise rejection", reason instanceof Error ? reason : undefined);
      void shutdown("unhandledRejection");
    });
    process.on("uncaughtException", (error) => {
      ReqLogService.error("uncaught exception", error);
      void shutdown("uncaughtException");
    });

    httpServer.listen(PORT, () => {
      ReqLogService.log(`server listening on port ${PORT}`);
    });
  } catch (error) {
    ReqLogService.error("Error starting the server", error instanceof Error ? error : undefined);
    process.exit(1);
  }
};

startServer();
