import { Server } from "socket.io";
import { socketStore } from "../store/socket.store";
import { MarkMessageAsReadUseCase } from "../../../../application/usecases/chat/mark-as-read.usecase";
import { UpdateUnReadMessageCountUseCase } from "../../../../application/usecases/chat/update-unread-count.usecase";

export interface SetActiveChatData {
  userId: string;
  partnerId: string;
}

export const handleSetActiveChat = async (
  io: Server,
  markMessageAsReadUseCase: MarkMessageAsReadUseCase,
  UpdateUnReadMessageCountUseCase: UpdateUnReadMessageCountUseCase,
  userId: string,
  partnerId: string
) => {
  socketStore.openChats.set(userId, partnerId);
  const readMessagesToUpdateUI = await markMessageAsReadUseCase.execute({
    userId,
    otherUserId: partnerId,
  });

  const updatedCountDoc = await UpdateUnReadMessageCountUseCase.execute({
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
