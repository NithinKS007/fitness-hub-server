export enum OnEvents {
  Connection = "connection",
  CheckOnline = "checkOnlineStatus",
  OpenChat = "openChat",
  CloseChat = "closeChat",
  SendMessage = "sendMessage",
  StartTyping = "startTyping",
  StopTyping = "stopTyping",
  StartVC = "startVC",
  AcceptVC = "acceptVC",
  RejectVC = "rejectVC",
  EndVC = "endVC",
  Disconnect = "disconnect",
  Connect_error = "connect_error",
}

export enum EmitEvents {
  onlineUpdate = "onlineStatusUpdate",
  
}
