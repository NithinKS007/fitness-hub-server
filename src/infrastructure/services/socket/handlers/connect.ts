import { Server, Socket } from "socket.io";
import { socketStore } from "../store/socket.store";
import { EmitEvents } from "@application/dtos/service/socket.service";

export const handleConnect = (socket: Socket, io: Server) => {
  console.log(`Socket connected`, {
    socketId: socket.id,
    user: socket.user,
  });
  socketStore.userSocketMap.set(socket?.user?._id, socket.id);
  socketStore.onlineUsers.add(socket?.user?._id);
  const isOnline = true;
  io.emit(EmitEvents.onlineUpdate, { userId: socket?.user?._id, isOnline });
};
