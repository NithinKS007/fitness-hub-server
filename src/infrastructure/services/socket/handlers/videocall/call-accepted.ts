import { EmitEvents } from "@application/dtos/service/socket.service";
import { Socket, Server } from "socket.io";

interface AcceptVideoCall {
  io: Server;
  socket: Socket;
  roomId: string;
}

export const handleAcceptCall = async ({
  socket,
  io,
  roomId,
}: AcceptVideoCall) => {
  try {
    socket.join(roomId);
    io.to(roomId).emit(EmitEvents.callStarted, { roomId });
  } catch (error: any) {
    io.to(roomId).emit(EmitEvents.error, {
      message:
        error.message ||
        "An unexpected error occurred while attempting to accept the call.",
      status: "error",
      code: error.code || 500,
    });
  }
};
