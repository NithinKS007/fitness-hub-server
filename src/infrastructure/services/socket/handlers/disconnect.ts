import { Socket } from "socket.io";
import { socketStore } from "../store/socket.store";

export const handleDisconnect = (
  socket: Socket,
) => {
  for (const [userId, socketId] of socketStore.userSocketMap.entries()) {
    if (socketId === socket.id) {
      socketStore.userSocketMap.delete(userId);
      socketStore.onlineUsers.delete(userId);
      socketStore.openChats.delete(userId);
      console.log(`user ${userId} disconnected`)
      break;
    }
  }
};
