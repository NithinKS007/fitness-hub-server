import { Server } from "socket.io";
import { ChatUseCase } from "../../../../application/usecases/chat/chat.usecase";
import { socketStore } from "../store/socket.store";

export interface SendMessageData {
  senderId: string;
  receiverId: string;
  message: string;
}

export const handleSendMessage = async (
  io: Server,
  chatUseCase: ChatUseCase,
  senderId: string,
  receiverId: string,
  message: string
) => {
  const currentChatPartner = socketStore.openChats.get(receiverId);
  const isChatOpen = currentChatPartner === senderId;

  const savedMessage = await chatUseCase.sendMessageAndSave({
    senderId,
    receiverId,
    message,
    isRead: isChatOpen,
  });

  await chatUseCase.updateLastMessage({
    userId: senderId,
    otherUserId: receiverId,
    lastMessageId: savedMessage._id.toString(),
  });

  let incrementedMessageDoc;
  if (!isChatOpen) {
    incrementedMessageDoc = await chatUseCase.incrementUnReadMessageCount({
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
