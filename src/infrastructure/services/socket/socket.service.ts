import { Server, Socket } from "socket.io";
import { ChatUseCase } from "../../../application/usecases/chat/chat.usecase";
import { TrainerGetUseCase } from "../../../application/usecases/trainer/get-trainer.usecase";
import { TrainerRepository } from "../../databases/repositories/trainer.repository";
import { AppointmentRepository } from "../../databases/repositories/appointment.repository";
import { ChatRepository } from "../../databases/repositories/chat.repository";
import { VideoCallLogRepository } from "../../databases/repositories/video-calllog.repository";
import { ConversationRepository } from "../../databases/repositories/conversation.repository";
import { handleConnect } from "./handlers/connect";
import { handleRegister } from "./handlers/register";
import {
  handleSetActiveChat,
  SetActiveChatData,
} from "./handlers/set-active-chat";
import { handleSendMessage, SendMessageData } from "./handlers/send-message";
import { handleTyping } from "./handlers/typing";
import { handleCheckOnline } from "./handlers/check-online";
import { handleCloseChat } from "./handlers/close-chat";
import { handleStopTyping } from "./handlers/stop-typing";
import { handleDisconnect } from "./handlers/disconnect";
import { handleInitiateCall } from "./handlers/videocall/call-Initiated";
import { handleAcceptCall } from "./handlers/videocall/call-accepted";
import { handleCallRejected } from "./handlers/videocall/call-rejected";
import { handleCallEnded } from "./handlers/videocall/call-ended";
import { CreateVideoCallLogUseCase } from "../../../application/usecases/videoCallLog/create-videocalllog.usecase";
import { UpdateVideoCallLogUseCase } from "../../../application/usecases/videoCallLog/update-videoCalllog.usecase";
import { GetAppointmentByIdUseCase } from "../../../application/usecases/appointment/get-bookingby-id.usecase";

//MONGO REPOSITORY INSTANCES
const mongoChatRepository = new ChatRepository();
const mongoVideoCallLogRepository = new VideoCallLogRepository();
const mongoTrainerRepository = new TrainerRepository();
const mongoAppointmentRepository = new AppointmentRepository();
const mongoConversationRepository = new ConversationRepository();

//USE CASE INSTANCES
const trainerGetUseCase = new TrainerGetUseCase(mongoTrainerRepository);
const chatUseCase = new ChatUseCase(
  mongoChatRepository,
  mongoConversationRepository
);

const createVideoCallLogUseCase = new CreateVideoCallLogUseCase(
  mongoVideoCallLogRepository
);
const updateVideoCallLogUseCase = new UpdateVideoCallLogUseCase(
  mongoVideoCallLogRepository
);

const getAppointmentByIdUseCase = new GetAppointmentByIdUseCase(
  mongoAppointmentRepository
);

export const socketService = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    handleConnect(socket);

    //CHAT BASED SOCKETS
    socket.on("register", (userId: string) => {
      handleRegister(io, socket, userId);
    });

    socket.on("checkOnlineStatus", (targetId: string) => {
      handleCheckOnline(socket, targetId);
    });

    socket.on(
      "setActiveChat",
      async ({ userId, partnerId }: SetActiveChatData) => {
        await handleSetActiveChat(io, chatUseCase, userId, partnerId);
      }
    );

    socket.on("closeChat", (userId: string) => {
      handleCloseChat(userId, socket);
    });

    socket.on(
      "sendMessage",
      async ({ senderId, receiverId, message }: SendMessageData) => {
        await handleSendMessage(io, chatUseCase, senderId, receiverId, message);
      }
    );

    socket.on(
      "typing",
      ({ senderId, receiverId }: { senderId: string; receiverId: string }) => {
        handleTyping({ io, senderId, receiverId });
      }
    );

    socket.on(
      "stopTyping",
      ({ senderId, receiverId }: { senderId: string; receiverId: string }) => {
        handleStopTyping({ io, senderId, receiverId });
      }
    );

    //VIDEO CALL BASED SOCKETS
    socket.on(
      "initiateVideoCall",
      async ({ callerId, receiverId, roomId, appointmentId }) => {
        handleInitiateCall({
          socket,
          io,
          trainerGetUseCase,
          getAppointmentByIdUseCase,
          createVideoCallLogUseCase,
          callerId,
          receiverId,
          roomId,
          appointmentId,
        });
      }
    );

    socket.on("acceptVideoCall", async ({ roomId, userId }) => {
      handleAcceptCall({ socket, io, roomId });
    });

    socket.on("rejectVideoCall", async ({ roomId }) => {
      handleCallRejected({ roomId, io, updateVideoCallLogUseCase });
    });

    socket.on("videoCallEnded", async ({ roomId }) => {
      handleCallEnded({ io, updateVideoCallLogUseCase, roomId });
    });

    //DISCONNECTION BASED SOCKET
    socket.on("disconnect", () => {
      handleDisconnect(socket);
    });
  });
};
