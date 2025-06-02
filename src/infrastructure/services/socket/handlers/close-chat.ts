import { socketStore } from "../store/socket.store";
import { Socket } from "socket.io";

export const handleCloseChat = (userId: string, socket: Socket) => {
  socketStore.openChats.delete(userId);
  console.log(`user ${userId} closed chat`, {
    socketId: socket.id,
  });
};
