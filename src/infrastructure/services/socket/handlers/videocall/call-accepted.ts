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
  socket.join(roomId);
  io.to(roomId).emit("callStarted", { roomId });
};
