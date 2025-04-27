import { Socket } from "socket.io";
import { LoggerHelper } from "../../../../shared/utils/handleLog";
import { socketStore } from "../socketStore/socketStore";

export const handleDisconnect = (
  socket: Socket,
  loggerHelper: LoggerHelper
) => {
  for (const [userId, socketId] of socketStore.userSocketMap.entries()) {
    if (socketId === socket.id) {
      socketStore.userSocketMap.delete(userId);
      socketStore.onlineUsers.delete(userId);
      socketStore.openChats.delete(userId);
      loggerHelper.handleLogInfo("info", `user ${userId} disconnected`);
      break;
    }
  }
  loggerHelper.handleLogInfo("info", `socket disconnected: ${socket.id}`);
};
