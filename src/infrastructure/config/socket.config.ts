import { Server as HttpServer } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import dotenv from "dotenv";
import { socketAuth } from "@infrastructure/services/socket/socket.auth.middleware";
dotenv.config();
const allowedOrigins = process.env.CLIENT_ORIGINS;

export const socketConfig = async (
  httpServer: HttpServer
): Promise<SocketIOServer> => {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: allowedOrigins,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.use((socket: Socket, next) => socketAuth(socket, next));
  console.log("socket connecting in server")
  return io;
};
