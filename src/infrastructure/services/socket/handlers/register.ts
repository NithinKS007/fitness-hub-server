import { Server, Socket } from "socket.io";
import { LoggerHelper } from "../../../../shared/utils/handleLog";
import { socketStore } from "../socketStore/socketStore";

export const handleRegister = (
  io: Server,
  socket: Socket,
  userId: string,
  loggerHelper: LoggerHelper
) => {
  socketStore.userSocketMap.set(userId, socket.id);
  socketStore.onlineUsers.add(userId);
  const isOnline = true;
  io.emit("onlineStatusUpdate", { userId, isOnline });
  loggerHelper.handleLogInfo(
    "info",
    `user ${userId} connected with socket. online status: ${isOnline}`,
    {
      socketId: socket.id,
    }
  );
};
