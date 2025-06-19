import dotenv from "dotenv";
import app from "@server";
import connectDB from "@infrastructure/config/db.config";
import { Server } from "socket.io";
import { socketService } from "@infrastructure/services/socket/socket.service";
import { createServer } from "http";
// Importing the type augmentation for the global 'Request' interface to ensure
// TypeScript recognizes the custom properties on the request object.
// This import is necessary to make sure the global type changes are applied.
import types from "../types/express";
import "reflect-metadata"

dotenv.config();
connectDB();

const allowedOrigins = process.env.CLIENT_ORIGINS;
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

socketService(io);

const PORT = process.env.PORT;
httpServer.listen(PORT, () => {
  if (!PORT) {
    console.error("PORT is not defined in .env file");
    process.exit(1);
  }
  console.log(`Server running on port ${process.env.PORT}`);
});
