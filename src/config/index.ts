import dotenv from "dotenv";
import app from "@server";
import connectDB from "@infrastructure/config/db.config";
import { socketService } from "@infrastructure/services/socket/socket.service";
import { createServer } from "http";
import "reflect-metadata";
import { socketConfig } from "@infrastructure/config/socket.config";
// Importing the type augmentation for the global 'Request' interface to ensure
// TypeScript recognizes the custom properties on the request object.
import types from "../types/express";

dotenv.config();

const startServer = async () => {
  try {
    await connectDB();

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
