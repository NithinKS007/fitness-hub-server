import { LoggerHelper } from "../../../../shared/utils/handleLog";
import { socketStore } from "../socketStore/socketStore";
import { Socket } from "socket.io";

export const handleCloseChat = (
  userId: string,
  socket: Socket,
  loggerHelper: LoggerHelper
) => {
  socketStore.openChats.delete(userId);
  loggerHelper.handleLogInfo("info", `user ${userId} closed chat`, {
    socketId: socket.id,
  });
};
