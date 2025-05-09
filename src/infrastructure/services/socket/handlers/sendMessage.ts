import { Server, Socket } from "socket.io";
import { LoggerHelper } from "../../../../shared/utils/handleLog";
import { ChatUseCase } from "../../../../application/usecases/chat/chatUseCase";
import { socketStore } from "../socketStore/socketStore";

export interface SendMessageData {
  senderId: string;
  receiverId: string;
  message: string;
}

export const handleSendMessage = async (
  io: Server,
  socket: Socket,
  chatUseCase: ChatUseCase,
  loggerHelper: LoggerHelper,
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
    loggerHelper.handleLogInfo(
      "info",
      `notified ${senderId} of read message ${savedMessage._id}`,
      { socketId: socket.id }
    );
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
