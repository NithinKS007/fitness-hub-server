export interface CreateChatDTO {
  senderId: string;
  receiverId: string;
  message: string;
  isRead: boolean;
}

export interface FindChatDTO {
  userId: string;
  otherUserId: string;
}
