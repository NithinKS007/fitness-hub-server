import { Socket } from "socket.io";
import { socketStore } from "@infrastructure/services/socket/store/socket.store";

export const handleCheckOnline = (socket: Socket, targetId: string) => {
  const isOnline = socketStore.onlineUsers.has(targetId);
  socket.emit("onlineStatusResponse", { userId: targetId, isOnline });
};
