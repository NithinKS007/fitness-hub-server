import { Socket, Server } from "socket.io";
import { LoggerHelper } from "../../../../../shared/utils/handleLog";

interface AcceptVideoCall {
  io: Server;
  socket: Socket;
  userId: string;
  roomId: string;
  loggerHelper: LoggerHelper;
}

export const handleAcceptCall = async ({
  socket,
  io,
  loggerHelper,
  userId,
  roomId,
}: AcceptVideoCall) => {
  loggerHelper.handleLogInfo(
    "info",
    `${userId} accepted call in room ${roomId}`
  );
  socket.join(roomId);
  io.to(roomId).emit("callStarted", { roomId });
};
