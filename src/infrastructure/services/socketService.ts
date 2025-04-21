import { Server, Socket } from "socket.io";
import { validationError } from "../../presentation/middlewares/errorMiddleWare";
import { VideoCallUseCase } from "../../application/usecases/videoCallUseCase";
import { ChatUseCase } from "../../application/usecases/chatUseCase";
import { TrainerUseCase } from "../../application/usecases/trainerUseCase";
import { MongoTrainerRepository } from "../databases/repositories/trainerRepository";
import { BookingSlotUseCase } from "../../application/usecases/bookingSlotUseCase";
import { MongoAppointmentRepository } from "../databases/repositories/appointmentRepository";
import { MongoBookingSlotRepository } from "../databases/repositories/bookingSlotRepository";
import { MongoChatRepository } from "../databases/repositories/chatRepository";
import { MongoVideoCallLogRepository } from "../databases/repositories/videoCallLogRepository";
import { MongoConversationRepository } from "../databases/repositories/conversationRepository";
import { handleLogInfo } from "../../shared/utils/handleLog";

//MONGO REPOSITORY INSTANCES
const mongoChatRepository = new MongoChatRepository();
const mongoVideoCallLogRepository = new MongoVideoCallLogRepository();
const mongoTrainerRepository = new MongoTrainerRepository();
const mongoAppointmentRepository = new MongoAppointmentRepository();
const mongoBookingSlotRepository = new MongoBookingSlotRepository();
const mongoConversationRepository = new MongoConversationRepository();

//USE CASE INSTANCES
const trainerUseCase = new TrainerUseCase(mongoTrainerRepository);
const chatUseCase = new ChatUseCase(
  mongoChatRepository,
  mongoConversationRepository
);
const videoCallLogUseCase = new VideoCallUseCase(mongoVideoCallLogRepository);
const bookingSlotUseCase = new BookingSlotUseCase(
  mongoBookingSlotRepository,
  mongoAppointmentRepository,
  mongoVideoCallLogRepository
);

const userSocketMap = new Map<string, string>();
const onlineUsers = new Set<string>();
const openChats = new Map<string, string>();

export const chatSocket = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    handleLogInfo("info", `Socket connected`, { socketId: socket.id });
    socket.on("register", (userId: string) => {
      userSocketMap.set(userId, socket.id);
      onlineUsers.add(userId);
      io.emit("onlineStatusUpdate", { userId, isOnline: true });
      handleLogInfo("info", `user ${userId} registered with socket`, {
        socketId: socket.id,
      });
    });

    socket.on("checkOnlineStatus", (targetId: string) => {
      const isOnline = onlineUsers.has(targetId);
      socket.emit("onlineStatusResponse", { userId: targetId, isOnline });
    });

    socket.on(
      "setActiveChat",
      async ({ userId, partnerId }: { userId: string; partnerId: string }) => {
        openChats.set(userId, partnerId);
        handleLogInfo("info", `User ${userId} opened chat with ${partnerId}`, {
          socketId: socket.id,
        });
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
          const messageIds = readMessagesToUpdateUI.map((msg) =>
            msg._id.toString()
          );
          const receiverSocketId = userSocketMap.get(userId);
          if (receiverSocketId) {
            io.to(receiverSocketId).emit("unreadCountUpdated", updatedCountDoc);
          }
          const senderSocketId = userSocketMap.get(partnerId);
          if (senderSocketId) {
            io.to(senderSocketId).emit("messageRead", { messageIds });
            if (updatedCountDoc) {
              io.to(senderSocketId).emit("unreadCountUpdated", updatedCountDoc);
            }
          }
        }
      }
    );

    socket.on("closeChat", (userId: string) => {
      openChats.delete(userId);
      handleLogInfo("info", `user ${userId} closed chat`, {
        socketId: socket.id,
      });
    });

    socket.on(
      "sendMessage",
      async ({
        senderId,
        receiverId,
        message,
      }: {
        senderId: string;
        receiverId: string;
        message: string;
      }) => {
        const currentChatPartner = openChats.get(receiverId);
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
          incrementedMessageDoc = await chatUseCase.incrementUnReadMessageCount(
            { userId: senderId, otherUserId: receiverId }
          );
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
        const receiverSocketId = userSocketMap.get(receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("receiveMessage", messageData);
          if (incrementedMessageDoc) {
            io.to(receiverSocketId).emit(
              "unreadCountUpdated",
              incrementedMessageDoc
            );
          }
          handleLogInfo(
            "info",
            `notified ${senderId} of read message ${savedMessage._id}`,
            { socketId: socket.id }
          );
        } else {
          handleLogInfo("info", `receiver ${receiverId} not connected`, {
            socketId: socket.id,
          });
        }
        const senderSocketId = userSocketMap.get(senderId);
        if (senderSocketId) {
          io.to(senderSocketId).emit("receiveMessage", messageData);

          if (isChatOpen) {
            io.to(senderSocketId).emit("messageRead", {
              messageIds: [savedMessage._id.toString()],
            });
            io.to(senderSocketId).emit(
              "unreadCountUpdated",
              incrementedMessageDoc
            );
          }
        }
      }
    );

    socket.on(
      "typing",
      ({ senderId, receiverId }: { senderId: string; receiverId: string }) => {
        const receiverSocketId = userSocketMap.get(receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("typing", { senderId });
        }
      }
    );

    socket.on(
      "stopTyping",
      ({ senderId, receiverId }: { senderId: string; receiverId: string }) => {
        const receiverSocketId = userSocketMap.get(receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("stopTyping", { senderId });
        }
      }
    );

    socket.on(
      "initiateVideoCall",
      async ({ callerId, receiverId, roomId, appointmentId }) => {
        handleLogInfo(
          "info",
          `video call initiated by ${callerId} to ${receiverId} in room ${roomId}`,
          { socketId: socket.id }
        );
        const trainerData = await trainerUseCase.getTrainerDetailsById(
          callerId
        );
        const appointmentData = await bookingSlotUseCase.getAppointmentById(
          appointmentId
        );

        if (appointmentData?.status === "cancelled") {
          handleLogInfo(
            "info",
            `call to ${receiverId} failed: Appointment cancelled`,
            { socketId: socket.id }
          );
          throw new validationError("Failed to connect");
        }

        const trainerName = `${trainerData.fname} ${trainerData.lname}`;
        const appointmentTime = appointmentData?.appointmentTime;
        const appointmentDate = appointmentData?.appointmentDate;
        await videoCallLogUseCase.createVideoCallLog({
          callerId: callerId,
          receiverId: receiverId,
          callRoomId: roomId,
          appointmentId: appointmentId,
          callStartTime: new Date(),
        });

        const receiverSocketId = userSocketMap.get(receiverId);
        if (!receiverSocketId) {
          handleLogInfo(
            "info",
            `no socket found for receiverId: ${receiverId}`,
            { socketId: socket.id }
          );
          return;
        }

        handleLogInfo(
          "info",
          `emitting incomingCall to socket ${receiverSocketId} for user ${receiverId}`,
          {
            trainerName,
            appointmentTime,
            appointmentDate,
            callerId,
            roomId,
            appointmentId,
          }
        );

        io.to(receiverSocketId).emit("incomingCall", {
          trainerName: trainerName,
          appointmentTime: appointmentTime,
          appointmentDate: appointmentDate,
          callerId: callerId,
          roomId: roomId,
          appointmentId: appointmentId,
        });
      }
    );

    socket.on("acceptVideoCall", async ({ roomId, userId }) => {
      handleLogInfo("info", `${userId} accepted call in room ${roomId}`);
      socket.join(roomId);
      io.to(roomId).emit("callStarted", { roomId });
    });

    socket.on("rejectVideoCall", async ({ roomId }) => {
      handleLogInfo("info", `call rejected for room ${roomId}`);
      const endTime = new Date();
      const videoCallLogData = await videoCallLogUseCase.updateVideoCallLog({
        callRoomId: roomId,
        callEndTime: endTime,
        callStatus: "missed",
      });
      if (videoCallLogData?.callStartTime && videoCallLogData?.callEndTime) {
        const duration = Math.floor(
          (videoCallLogData.callEndTime.getTime() -
            videoCallLogData.callStartTime.getTime()) /
            1000
        );
        await videoCallLogUseCase.updateVideoCallDuration({
          callRoomId: roomId,
          callDuration: duration,
        });
      } else {
        handleLogInfo(
          "error",
          `failed to calculate duration for ${roomId}: missing start or end time`
        );
      }
      io.to(roomId).emit("callEnded");
    });

    socket.on("videoCallEnded", async ({ roomId }) => {
      handleLogInfo("info", `call ended in room ${roomId}`);
      const endTime = new Date();
      const videoCallLogData = await videoCallLogUseCase.updateVideoCallLog({
        callRoomId: roomId,
        callEndTime: endTime,
        callStatus: "completed",
      });
      if (videoCallLogData?.callStartTime && videoCallLogData?.callEndTime) {
        const duration = Math.floor(
          (videoCallLogData.callEndTime.getTime() -
            videoCallLogData.callStartTime.getTime()) /
            1000
        );
        await videoCallLogUseCase.updateVideoCallDuration({
          callRoomId: roomId,
          callDuration: duration,
        });
      } else {
        handleLogInfo(
          "error",
          `failed to calculate duration for ${roomId}: missing start or end time`
        );
      }
      io.to(roomId).emit("callEnded");
    });

    socket.on("disconnect", () => {
      for (const [userId, socketId] of userSocketMap.entries()) {
        if (socketId === socket.id) {
          userSocketMap.delete(userId);
          onlineUsers.delete(userId);
          openChats.delete(userId);
          handleLogInfo("info", `user ${userId} disconnected`);
          break;
        }
      }
      handleLogInfo("info", `socket disconnected: ${socket.id}`);
    });
  });
};
