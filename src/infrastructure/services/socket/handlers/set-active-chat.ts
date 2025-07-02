import { Server } from "socket.io";
import { socketStore } from "@infrastructure/services/socket/store/socket.store";
import { MarkMessageAsReadUseCase } from "@application/usecases/chat/mark-as-read.usecase";
import { UpdateUnReadMessageCountUseCase } from "@application/usecases/chat/update-unread-count.usecase";

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
  const readmsgs = await markMessageAsReadUseCase.execute({
    userId,
    otherUserId: partnerId,
  });

  if (!readmsgs || readmsgs.length === 0) return;

  const updatedCount = await UpdateUnReadMessageCountUseCase.execute({
    userId,
    otherUserId: partnerId,
    count: 0,
  });

  const receiverSocketId = socketStore.userSocketMap.get(userId);
  const senderSocketId = socketStore.userSocketMap.get(partnerId);

  const messageIds = readmsgs.map((msg) => msg._id.toString());

  if (senderSocketId) {
    io.to(senderSocketId).emit("messageRead", { messageIds });
  }

  if (!updatedCount) return;

  if (receiverSocketId) {
    io.to(receiverSocketId).emit("unreadCountUpdated", updatedCount);
  }

  if (senderSocketId) {
    io.to(senderSocketId).emit("unreadCountUpdated", updatedCount);
  }

};
