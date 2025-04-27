import { Socket } from "socket.io";
import { LoggerHelper } from "../../../../shared/utils/handleLog";

export const handleConnect = (socket: Socket, loggerHelper: LoggerHelper) => {
  loggerHelper.handleLogInfo("info", `Socket connected`, {
    socketId: socket.id,
  });
};
