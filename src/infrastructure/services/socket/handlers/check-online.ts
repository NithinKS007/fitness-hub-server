import { Socket } from "socket.io";
import { socketStore } from "@infrastructure/services/socket/store/socket.store";
import { EmitEvents } from "@application/dtos/service/socket.service";

export const handleCheckOnline = (socket: Socket, targetId: string) => {
  const isOnline = socketStore.onlineUsers.has(targetId);
  socket.emit(EmitEvents.onlineStatusResponse, { userId: targetId, isOnline });
};
