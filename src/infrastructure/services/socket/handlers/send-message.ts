import { Server } from "socket.io";
import { socketStore } from "@infrastructure/services/socket/store/socket.store";
import { CreateMessageUseCase } from "@application/usecases/chat/create-message.usecase";
import { IncrementUnReadMessageCountUseCase } from "@application/usecases/chat/inc-unread-count.usecase";
import { UpdateLastMessageUseCase } from "@application/usecases/chat/update-last-message.usecase";

export interface SendMessageData {
  senderId: string;
  receiverId: string;
  message: string;
}

export const handleSendMessage = async (
  io: Server,
  createMessageUseCase: CreateMessageUseCase,
  incUnReadCountUseCase: IncrementUnReadMessageCountUseCase,
  updateLastMessageUseCase: UpdateLastMessageUseCase,
  senderId: string,
  receiverId: string,
  message: string
) => {
  const currentChatPartner = socketStore.openChats.get(receiverId);
  const isChatOpen = currentChatPartner === senderId;
  const savedMessage = await createMessageUseCase.execute({
    senderId,
    receiverId,
    message,
    isRead: isChatOpen,
  });

  await updateLastMessageUseCase.execute({
    userId: senderId,
    otherUserId: receiverId,
    lastMessageId: savedMessage._id.toString(),
  });

  let incrementedMessageDoc;
  if (!isChatOpen) {
    incrementedMessageDoc = await incUnReadCountUseCase.execute({
      userId: senderId,
      otherUserId: receiverId,
    });
  }

  const messageData = {
    _id: savedMessage._id.toString(),
    senderId,
    receiverId,
    message,
    createdAt: savedMessage.createdAt,
    updatedAt: savedMessage.updatedAt,
    isRead: savedMessage.isRead,
  };

  const receiverSocketId = socketStore.userSocketMap.get(receiverId);
  if (receiverSocketId) {
    io.to(receiverSocketId).emit("receiveMessage", messageData);
    if (incrementedMessageDoc) {
      io.to(receiverSocketId).emit("unreadCountUpdated", incrementedMessageDoc);
    }
  }

  const senderSocketId = socketStore.userSocketMap.get(senderId);
  if (senderSocketId) {
    io.to(senderSocketId).emit("receiveMessage", messageData);

    if (isChatOpen) {
      io.to(senderSocketId).emit("messageRead", {
        messageIds: [savedMessage._id.toString()],
      });
      io.to(senderSocketId).emit("unreadCountUpdated", incrementedMessageDoc);
    }
  }
};
