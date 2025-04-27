import { Server, Socket } from "socket.io";
import { LoggerHelper } from "../../../../shared/utils/handleLog";
import { ChatUseCase } from "../../../../application/usecases/chat/chatUseCase";
import { socketStore } from "../socketStore/socketStore";

export interface SetActiveChatData {
  userId: string;
  partnerId: string;
}

export const handleSetActiveChat = async (
  io: Server,
  socket: Socket,
  chatUseCase: ChatUseCase,
  loggerHelper: LoggerHelper,
  userId: string,
  partnerId: string
) => {
  socketStore.openChats.set(userId, partnerId);
  loggerHelper.handleLogInfo(
    "info",
    `user ${userId} opened chat with ${partnerId}`,
    {
      socketId: socket.id,
    }
  );

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
