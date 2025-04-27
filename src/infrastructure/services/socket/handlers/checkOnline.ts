import { Socket } from "socket.io";
import { socketStore } from "../socketStore/socketStore";

export const handleCheckOnline = (socket: Socket, targetId: string) => {
  const isOnline = socketStore.onlineUsers.has(targetId);
  socket.emit("onlineStatusResponse", { userId: targetId, isOnline });
};
