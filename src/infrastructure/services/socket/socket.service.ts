import { Server as SocketIOServer, Socket } from "socket.io";
import { handleConnect } from "@infrastructure/services/socket/handlers/connect";
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
import { handleCloseChat } from "@infrastructure/services/socket/handlers/close-active-chat";
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
} from "@di/container-resolver";
import { EventTypes } from "@application/dtos/service/socket.service";

export const socketService = async (io: SocketIOServer) => {
  io.on(EventTypes.Connection, (socket: Socket) => {
    handleConnect(socket, io);

    socket.on(EventTypes.CheckOnline, (targetId: string) => {
      handleCheckOnline(socket, targetId);
    });

    socket.on(
      EventTypes.OpenChat,
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

    socket.on(EventTypes.CloseChat, (userId: string) => {
      handleCloseChat(userId, socket);
    });

    socket.on(
      EventTypes.SendMessage,
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
      EventTypes.StartTyping,
      ({ senderId, receiverId }: { senderId: string; receiverId: string }) => {
        handleTyping({ io, senderId, receiverId });
      }
    );

    socket.on(
      EventTypes.StopTyping,
      ({ senderId, receiverId }: { senderId: string; receiverId: string }) => {
        handleStopTyping({ io, senderId, receiverId });
      }
    );

    //VIDEO CALL BASED SOCKETS
    socket.on(
      EventTypes.StartVC,
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

    socket.on(EventTypes.AcceptVC, async ({ roomId, userId }) => {
      handleAcceptCall({ socket, io, roomId });
    });

    socket.on(EventTypes.RejectVC, async ({ roomId }) => {
      handleCallRejected({
        roomId,
        io,
        updateVideoCallStatusUseCase,
        updateVideoCallDurationUseCase,
      });
    });

    socket.on(EventTypes.EndVC, async ({ roomId }) => {
      handleCallEnded({
        io,
        updateVideoCallStatusUseCase,
        updateVideoCallDurationUseCase,
        roomId,
      });
    });

    //DISCONNECTION BASED SOCKET
    socket.on(EventTypes.Disconnect, () => {
      handleDisconnect(socket);
    });

    socket.on(EventTypes.Connect_error, (err) => {
      console.log("Connection error:", err);
    });
  });

  io.on("error", (err) => {
    console.log("Server error:", err);
  });
};
