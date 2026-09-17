import dotenv from "dotenv";
import app from "@server";
import { socketService } from "@infrastructure/services/socket/socket.service";
import { createServer } from "http";
import "reflect-metadata";
import { socketConfig } from "@infrastructure/config/socket.config";
import types from "../types/express";
import { connectDB } from "@di/container-resolver";

dotenv.config();

const startServer = async () => { 
  try {

    await connectDB.connectMongo();
    const httpServer = createServer(app);
    const io = await socketConfig(httpServer);
    await socketService(io);

    const PORT = process.env.PORT;
    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.log("Error starting the server:", error);
    process.exit(1);
  }
};

startServer();
