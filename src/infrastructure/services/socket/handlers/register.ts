import { Server, Socket } from "socket.io";
import { socketStore } from "@infrastructure/services/socket/store/socket.store";

export const handleRegister = (
  io: Server,
  socket: Socket,
  userId: string,
) => {
  socketStore.userSocketMap.set(userId, socket.id);
  socketStore.onlineUsers.add(userId);
  const isOnline = true;
  io.emit("onlineStatusUpdate", { userId, isOnline });
};
