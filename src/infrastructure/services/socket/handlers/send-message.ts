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

  const { _id: svdmsgId, createdAt, updatedAt, isRead } = savedMessage;

  await updateLastMessageUseCase.execute({
    userId: senderId,
    otherUserId: receiverId,
    lastMessageId: svdmsgId.toString(),
  });

  const receiverSocketId = socketStore.userSocketMap.get(receiverId);
  const senderSocketId = socketStore.userSocketMap.get(senderId);
  const messageData = {
    _id: svdmsgId.toString(),
    senderId,
    receiverId,
    message,
    createdAt,
    updatedAt,
    isRead,
  };

  if (!isChatOpen) {
    // If the receiver's chat is not open, increment unread count for the receiver
    const incrementedMessageDoc = await incUnReadCountUseCase.execute({
      userId: senderId,
      otherUserId: receiverId,
    });

    // Send the message to the receiver
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receiveMessage", messageData);
      io.to(receiverSocketId).emit("unreadCountUpdated", incrementedMessageDoc);
    }

    // Send the message to the sender
    if (senderSocketId) {
      io.to(senderSocketId).emit("receiveMessage", messageData);
      io.to(senderSocketId).emit("unreadCountUpdated", incrementedMessageDoc);
    }
  } else {
    // If the receiver's chat is open, no unread count increment
    // Send the message to the receiver
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receiveMessage", messageData);
    }

    if (senderSocketId) {
      io.to(senderSocketId).emit("receiveMessage", messageData);
      io.to(senderSocketId).emit("messageRead", {
        messageIds: [svdmsgId.toString()],
      });
    }
  }
};
