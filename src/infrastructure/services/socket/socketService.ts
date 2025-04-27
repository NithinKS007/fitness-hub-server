import { Server, Socket } from "socket.io";
import { VideoCallLogUseCase } from "../../../application/usecases/videoCallLog/videoCallLogUseCase";
import { ChatUseCase } from "../../../application/usecases/chat/chatUseCase";
import { TrainerUseCase } from "../../../application/usecases/trainer/trainerUseCase";
import { MongoTrainerRepository } from "../../databases/repositories/trainerRepository";
import { MongoAppointmentRepository } from "../../databases/repositories/appointmentRepository";
import { MongoChatRepository } from "../../databases/repositories/chatRepository";
import { MongoVideoCallLogRepository } from "../../databases/repositories/videoCallLogRepository";
import { MongoConversationRepository } from "../../databases/repositories/conversationRepository";
import { LoggerService } from "../../logging/logger";
import { LoggerHelper } from "../../../shared/utils/handleLog";
import { handleConnect } from "./handlers/connect";
import { handleRegister } from "./handlers/register";
import {
  handleSetActiveChat,
  SetActiveChatData,
} from "./handlers/setActiveChat";
import { handleSendMessage, SendMessageData } from "./handlers/sendMessage";
import { handleTyping } from "./handlers/typing";
import { handleCheckOnline } from "./handlers/checkOnline";
import { handleCloseChat } from "./handlers/closeChat";
import { handleStopTyping } from "./handlers/stopTyping";
import { handleDisconnect } from "./handlers/disconnect";
import { handleInitiateCall } from "./handlers/videoCall/callInitiated";
import { handleAcceptCall } from "./handlers/videoCall/callAccepted";
import { handleCallRejected } from "./handlers/videoCall/callRejected";
import { handleCallEnded } from "./handlers/videoCall/callEnded";
import { GetAppointmentUsecase } from "../../../application/usecases/appointment/getAppointmentUseCase";

//MONGO REPOSITORY INSTANCES
const mongoChatRepository = new MongoChatRepository();
const mongoVideoCallLogRepository = new MongoVideoCallLogRepository();
const mongoTrainerRepository = new MongoTrainerRepository();
const mongoAppointmentRepository = new MongoAppointmentRepository();
const mongoConversationRepository = new MongoConversationRepository();

//USE CASE INSTANCES
const trainerUseCase = new TrainerUseCase(mongoTrainerRepository);
const chatUseCase = new ChatUseCase(
  mongoChatRepository,
  mongoConversationRepository
);
const videoCallLogUseCase = new VideoCallLogUseCase(mongoVideoCallLogRepository);

const getAppointmentUseCase = new GetAppointmentUsecase(
  mongoAppointmentRepository
);

// Logger Setup
const logger = new LoggerService();
const loggerHelper = new LoggerHelper(logger);

export const socketService = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    handleConnect(socket, loggerHelper);

    //CHAT BASED SOCKETS
    socket.on("register", (userId: string) => {
      handleRegister(io, socket, userId, loggerHelper);
    });

    socket.on("checkOnlineStatus", (targetId: string) => {
      handleCheckOnline(socket, targetId);
    });

    socket.on(
      "setActiveChat",
      async ({ userId, partnerId }: SetActiveChatData) => {
        await handleSetActiveChat(
          io,
          socket,
          chatUseCase,
          loggerHelper,
          userId,
          partnerId
        );
      }
    );

    socket.on("closeChat", (userId: string) => {
      handleCloseChat(userId, socket, loggerHelper);
    });

    socket.on(
      "sendMessage",
      async ({ senderId, receiverId, message }: SendMessageData) => {
        await handleSendMessage(
          io,
          socket,
          chatUseCase,
          loggerHelper,
          senderId,
          receiverId,
          message
        );
      }
    );

    socket.on("typing", ({ senderId, receiverId }: {senderId:string,receiverId:string}) => {
      handleTyping({io, senderId, receiverId});
    });

    socket.on("stopTyping", ({ senderId, receiverId }: {senderId:string,receiverId:string}) => {
      handleStopTyping({io, senderId, receiverId});
    });

    //VIDEO CALL BASED SOCKETS
    socket.on(
      "initiateVideoCall",
      async ({ callerId, receiverId, roomId, appointmentId }) => {
        handleInitiateCall({
          socket,
          io,
          loggerHelper,
          trainerUseCase,
          getAppointmentUseCase,
          videoCallLogUseCase,
          callerId,
          receiverId,
          roomId,
          appointmentId,
        });
      }
    );

    socket.on("acceptVideoCall", async ({ roomId, userId }) => {
      handleAcceptCall({ socket, io, loggerHelper, roomId, userId });
    });

    socket.on("rejectVideoCall", async ({ roomId }) => {
      handleCallRejected({ roomId, io, loggerHelper, videoCallLogUseCase });
    });

    socket.on("videoCallEnded", async ({ roomId }) => {
      handleCallEnded({ io, loggerHelper, videoCallLogUseCase, roomId });
    });

    //DISCONNECTION BASED SOCKET
    socket.on("disconnect", () => {
      handleDisconnect(socket, loggerHelper);
    });
  });
};
