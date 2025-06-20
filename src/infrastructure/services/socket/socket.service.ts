import { Server, Socket } from "socket.io";
import { handleConnect } from "@infrastructure/services/socket/handlers/connect";
import { handleRegister } from "@infrastructure/services/socket/handlers/register";
import {
  handleSetActiveChat,
  SetActiveChatData,
} from "@infrastructure/services/socket/handlers/set-active-chat";
import {
  handleSendMessage,
  SendMessageData,
} from "@infrastructure/services/socket/handlers/send-message";
import { handleTyping } from "@infrastructure/services/socket/handlers/typing";
import { handleCheckOnline } from "@infrastructure/services/socket/handlers/check-online";
import { handleCloseChat } from "@infrastructure/services/socket/handlers/close-chat";
import { handleStopTyping } from "@infrastructure/services/socket/handlers/stop-typing";
import { handleDisconnect } from "@infrastructure/services/socket/handlers/disconnect";
import { handleInitiateCall } from "@infrastructure/services/socket/handlers/videocall/call-Initiated";
import { handleAcceptCall } from "@infrastructure/services/socket/handlers/videocall/call-accepted";
import { handleCallRejected } from "@infrastructure/services/socket/handlers/videocall/call-rejected";
import { handleCallEnded } from "@infrastructure/services/socket/handlers/videocall/call-ended";
import {
  createMessageUseCase,
  incUnReadCountUseCase,
  markMessageAsReadUseCase,
  updateLastMessageUseCase,
  updateUnReadMessageCount,
  getTrainerDetailsUseCase,
  getAppointmentByIdUseCase,
  createVideoCallLogUseCase,
  updateVideoCallStatusUseCase,
  updateVideoCallDurationUseCase,
} from "di/container-resolver";

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
        await handleSetActiveChat(
          io,
          markMessageAsReadUseCase,
          updateUnReadMessageCount,
          userId,
          partnerId
        );
      }
    );

    socket.on("closeChat", (userId: string) => {
      handleCloseChat(userId, socket);
    });

    socket.on(
      "sendMessage",
      async ({ senderId, receiverId, message }: SendMessageData) => {
        await handleSendMessage(
          io,
          createMessageUseCase,
          incUnReadCountUseCase,
          updateLastMessageUseCase,
          senderId,
          receiverId,
          message
        );
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
          io,
          getTrainerDetailsUseCase,
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
      handleCallRejected({
        roomId,
        io,
        updateVideoCallStatusUseCase,
        updateVideoCallDurationUseCase,
      });
    });

    socket.on("videoCallEnded", async ({ roomId }) => {
      handleCallEnded({
        io,
        updateVideoCallStatusUseCase,
        updateVideoCallDurationUseCase,
        roomId,
      });
    });

    //DISCONNECTION BASED SOCKET
    socket.on("disconnect", () => {
      handleDisconnect(socket);
    });
  });
};
