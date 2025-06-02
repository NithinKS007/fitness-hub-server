import { Server, Socket } from "socket.io";
import { ChatUseCase } from "../../../../application/usecases/chat/chat.usecase";
import { socketStore } from "../store/socket.store";

export interface SetActiveChatData {
  userId: string;
  partnerId: string;
}

export const handleSetActiveChat = async (
  io: Server,
  chatUseCase: ChatUseCase,
  userId: string,
  partnerId: string
) => {
  socketStore.openChats.set(userId, partnerId);
  const readMessagesToUpdateUI = await chatUseCase.markMessageAsRead({
    userId,
    otherUserId: partnerId,
  });

  const updatedCountDoc = await chatUseCase.updateUnReadMessageCount({
    userId,
    otherUserId: partnerId,
    count: 0,
  });

  if (readMessagesToUpdateUI && readMessagesToUpdateUI.length > 0) {
    const messageIds = readMessagesToUpdateUI.map((msg) => msg._id.toString());
    const receiverSocketId = socketStore.userSocketMap.get(userId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("unreadCountUpdated", updatedCountDoc);
    }
    const senderSocketId = socketStore.userSocketMap.get(partnerId);
    if (senderSocketId) {
      io.to(senderSocketId).emit("messageRead", { messageIds });
      if (updatedCountDoc) {
        io.to(senderSocketId).emit("unreadCountUpdated", updatedCountDoc);
      }
    }
  }
};
