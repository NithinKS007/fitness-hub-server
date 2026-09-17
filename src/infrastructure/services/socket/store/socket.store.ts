export interface SocketStore {
  userSocketMap: Map<string, string>;
  openChats: Map<string, string>;
}

export const socketStore: SocketStore = {
  userSocketMap: new Map<string, string>(),
  openChats: new Map<string, string>(),
};
