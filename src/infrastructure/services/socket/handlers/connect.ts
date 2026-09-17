import { Server, Socket } from "socket.io";
import { socketStore } from "../store/socket.store";
import { EmitEvents } from "@application/dtos/service/socket.service";

export const handleConnect = (socket: Socket, io: Server) => {
  console.log(`Socket connected`, {
    socketId: socket.id,
    user: socket.user,
  });
  socketStore.userSocketMap.set(socket?.user?.id, socket.id);
  const isOnline = true;
  const partnerIds = socketStore.openChats.get(socket?.user?.id);
  if (partnerIds && partnerIds?.length > 0) {
    for (const partnerId of partnerIds) {
      io.to(partnerId).emit(EmitEvents.OnlineStatusResponse, {
        userId: socket?.user?.id,
        isOnline,
      });
    }
  }
};
