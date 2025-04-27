export interface SocketStore {
  userSocketMap: Map<string, string>;
  onlineUsers: Set<string>;
  openChats: Map<string, string>;
}

export const socketStore: SocketStore = {
  userSocketMap: new Map<string, string>(),
  onlineUsers: new Set<string>(),
  openChats: new Map<string, string>(),
};
