import { Message } from "@domain/entities/message.entity";

export interface CreateChatDTO {
  senderId: string;
  receiverId: string;
  message: string;
  isRead: boolean;
}

export interface FindMessageDTO {
  userId: string;
  otherUserId: string;
  page?: number;
  limit?: number;
}

export interface ChatLastMsg {
  id: string;
  userId: string;
  trainerId: string;
  lastMessage: Message | null;
  unreadCount: number;
  providerSubStatus: string;
}
