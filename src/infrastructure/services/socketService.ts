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

//MONGO REPOSITORY INSTANCES
const mongoChatRepository = new MongoChatRepository();
const mongoVideoCallLogRepository = new MongoVideoCallLogRepository();
const mongoTrainerRepository = new MongoTrainerRepository();
const mongoAppointmentRepository = new MongoAppointmentRepository();
const mongoBookingSlotRepository = new MongoBookingSlotRepository();
const mongoConversationRepository = new MongoConversationRepository()

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
const openChats = new Map<string, string>()

export const chatSocket = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log(`socket id connected: ${socket.id}`);

    socket.on("register", (userId: string) => {
      userSocketMap.set(userId, socket.id);
      onlineUsers.add(userId);
      io.emit("onlineStatusUpdate", { userId, isOnline: true });
      console.log(`User ${userId} registered with socket ${socket.id}`);
    });

    socket.on("checkOnlineStatus", (targetId: string) => {
      const isOnline = onlineUsers.has(targetId);
      socket.emit("onlineStatusResponse", { userId: targetId, isOnline });
    });

    socket.on("setActiveChat",async ({ userId, partnerId }: { userId: string; partnerId: string }) => {
      openChats.set(userId, partnerId);
      console.log(`User ${userId} opened chat with ${partnerId}`);
      const readMessagesToUpdateUI = await chatUseCase.markMessageAsRead({userId,otherUserId:partnerId})
      if(readMessagesToUpdateUI && readMessagesToUpdateUI.length > 0 ) {
        const messageIds = readMessagesToUpdateUI.map(msg => msg._id.toString())
        const receiverSocketId = userSocketMap.get(userId)
        if(receiverSocketId){
          readMessagesToUpdateUI.forEach(msg => {
            io.to(receiverSocketId).emit("receiveMessage", {
              _id: msg._id.toString(),
              senderId: msg.senderId,
              receiverId: msg.receiverId,
              message: msg.message,
              createdAt: msg.createdAt,
              isRead: msg.isRead,
            });
          });
        }
        const senderSocketId = userSocketMap.get(partnerId);
        if (senderSocketId) {
          io.to(senderSocketId).emit("messageRead", { messageIds });
        }
      }
    });

    socket.on("closeChat", (userId: string) => {
      openChats.delete(userId);
      console.log(`User ${userId} closed chat`);
    });


    socket.on("sendMessage", async ({ senderId, receiverId, message }:{ senderId: string; receiverId: string; message: string }) => {
      const currentChatPartner = openChats.get(receiverId);
      const isChatOpen = currentChatPartner === senderId;
      
      const savedMessage = await chatUseCase.sendMessageAndSave({
        senderId,
        receiverId,
        message,
        isRead:isChatOpen
      });

      await chatUseCase.updateLastMessage({userId:senderId,otherUserId:receiverId,message:message})

      const receiverSocketId = userSocketMap.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receiveMessage", {
          _id: savedMessage._id,
          senderId,
          receiverId,
          message,
          createdAt: savedMessage?.createdAt,
          isRead: savedMessage.isRead
        });
        console.log(
          `Message emitted to socket ${receiverSocketId} for user ${receiverId}`
        );

      } else {
        console.log(`Receiver ${receiverId} not connected`);
      }
      const senderSocketId = userSocketMap.get(senderId);

      console.log("is chat open",isChatOpen,"sender id",senderSocketId)
      if (senderSocketId) {
        io.to(senderSocketId).emit("receiveMessage",{
        _id: savedMessage._id.toString(),
        senderId,
        receiverId,
        message,
        createdAt: savedMessage.createdAt,
        isRead: savedMessage.isRead
      })
        console.log(`Message emitted to socket ${senderSocketId} for user ${senderId}`);
        console.log("emiting to the user to mark as read","saved message id",savedMessage._id,"sender id",senderId)

        if (isChatOpen) {
          io.to(senderSocketId).emit("messageRead", {
            messageIds: [savedMessage._id.toString()],
          });
        console.log(`Notified ${senderId} of read message ${savedMessage._id}`);
       }
     }
    })

    socket.on("typing",({ senderId, receiverId }: { senderId: string; receiverId: string })=>{
       console.log("typing event triggered",senderId,receiverId)
       const receiverSocketId = userSocketMap.get(receiverId);
       if(receiverSocketId){
         io.to(receiverSocketId).emit("typing",{senderId})
       }
    })

    socket.on('stopTyping', ({ senderId, receiverId }: { senderId: string; receiverId: string }) => {
      console.log("typing event triggered",senderId,receiverId)
      const receiverSocketId = userSocketMap.get(receiverId);
      if(receiverSocketId){
        io.to(receiverSocketId).emit('stopTyping', { senderId });
      }
    });

   

    //HANDLE VIDEO CALLS

    socket.on(
      "initiateVideoCall",
      async ({ callerId, receiverId, roomId, appointmentId }) => {
        console.log(
          `Video call initiated by ${callerId} to ${receiverId} in room ${roomId}`
        );
        const trainerData = await trainerUseCase.getTrainerDetailsById(
          callerId
        );
        const appointmentData = await bookingSlotUseCase.getAppointmentById(
          appointmentId
        );

        if (appointmentData?.status === "cancelled") {
          console.log(`Call to ${receiverId} failed: Appointment cancelled`);
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
          console.log(`No socket found for receiverId: ${receiverId}`);
          return;
        }

        console.log(
          `Emitting incomingCall to socket ${receiverSocketId} for user ${receiverId}`,
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
      console.log(`${userId} accepted call in room ${roomId}`);
      socket.join(roomId);
      io.to(roomId).emit("callStarted", { roomId });
    });

    socket.on("rejectVideoCall", async ({ roomId }) => {
      console.log(`Call rejected for room ${roomId}`);
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
        console.error(
          `Failed to calculate duration for ${roomId}: Missing start or end time`
        );
      }
      io.to(roomId).emit("callEnded");
    });

    socket.on("videoCallEnded", async ({ roomId }) => {
      console.log(`Call ended in room ${roomId}`);
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
        console.error(
          `Failed to calculate duration for ${roomId}: Missing start or end time`
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
          console.log(`User ${userId} disconnected`);
          break;
        }
      }
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });
};
