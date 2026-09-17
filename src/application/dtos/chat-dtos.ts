import { Message } from "@domain/entities/message.entity";
import { ObjectId } from "mongoose";

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
  id: ObjectId;
  userId: ObjectId;
  trainerId: ObjectId;
  lastMessage: Message | null;
  unreadCount: number;
  providerSubStatus: string;
}
