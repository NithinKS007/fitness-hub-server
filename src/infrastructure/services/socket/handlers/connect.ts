import { Socket } from "socket.io";

export const handleConnect = (socket: Socket) => {
  console.log(`Socket connected`, {
    socketId: socket.id,
  });
};
