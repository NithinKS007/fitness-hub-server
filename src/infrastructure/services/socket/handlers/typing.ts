import { Server } from "socket.io";
import { socketStore } from "../socketStore/socketStore";

export interface TypingData {
  io: Server;
  senderId: string;
  receiverId: string;
}
export const handleTyping = ({ io, senderId, receiverId }: TypingData) => {
  const receiverSocketId = socketStore.userSocketMap.get(receiverId);
  if (receiverSocketId) {
    io.to(receiverSocketId).emit("typing", { senderId });
  }
};
