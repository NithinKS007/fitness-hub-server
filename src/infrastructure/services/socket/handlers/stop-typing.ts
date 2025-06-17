import { Server } from "socket.io";
import { socketStore } from "@infrastructure/services/socket/store/socket.store";

export interface TypingData {
  io: Server;
  senderId: string;
  receiverId: string;
}

export const handleStopTyping = ({ io, senderId, receiverId }: TypingData) => {
  const receiverSocketId = socketStore.userSocketMap.get(receiverId);
  if (receiverSocketId) {
    io.to(receiverSocketId).emit("stopTyping", { senderId });
  }
};
