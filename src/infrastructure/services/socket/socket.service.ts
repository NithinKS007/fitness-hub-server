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
import { OnEvents } from "@application/dtos/service/socket.service";

export const socketService = async (io: SocketIOServer) => {
  io.on(OnEvents.Connection, (socket: Socket) => {
    handleConnect(socket, io);

    socket.on(OnEvents.CheckOnline, (targetId: string) => {
      handleCheckOnline(socket, targetId);
    });

    socket.on(
      OnEvents.OpenChat,
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

    socket.on(OnEvents.CloseChat, (userId: string) => {
      handleCloseChat(userId, socket);
    });

    socket.on(
      OnEvents.SendMessage,
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
      OnEvents.StartTyping,
      ({ senderId, receiverId }: { senderId: string; receiverId: string }) => {
        handleTyping({ io, senderId, receiverId });
      }
    );

    socket.on(
      OnEvents.StopTyping,
      ({ senderId, receiverId }: { senderId: string; receiverId: string }) => {
        handleStopTyping({ io, senderId, receiverId });
      }
    );

    //VIDEO CALL BASED SOCKETS
    socket.on(
      OnEvents.StartVC,
      async ({ callerId, receiverId, roomId, token, appId, appointmentId }) => {
        handleInitiateCall({
          io,
          getTrainerDetailsUseCase,
          getAppointmentByIdUseCase,
          createVideoCallLogUseCase,
          callerId,
          receiverId,
          roomId,
          token,
          appId,
          appointmentId,
        });
      }
    );

    socket.on(OnEvents.AcceptVC, async ({ roomId, userId }) => {
      handleAcceptCall({ socket, io, roomId });
    });

    socket.on(OnEvents.RejectVC, async ({ roomId }) => {
      handleCallRejected({
        roomId,
        io,
        updateVideoCallStatusUseCase,
        updateVideoCallDurationUseCase,
      });
    });

    socket.on(OnEvents.EndVC, async ({ roomId }) => {
      handleCallEnded({
        io,
        updateVideoCallStatusUseCase,
        updateVideoCallDurationUseCase,
        roomId,
      });
    });

    //DISCONNECTION BASED SOCKET
    socket.on(OnEvents.Disconnect, () => {
      handleDisconnect(socket);
    });

    socket.on(OnEvents.Connect_error, (err) => {
      console.log("Connection error:", err);
    });
  });

  io.on("error", (err) => {
    console.log("Server error:", err);
  });
};
