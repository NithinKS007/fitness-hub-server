import { IChat } from "@domain/entities/chat.entity";
import { ObjectId } from "mongoose";

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

interface BaseChatList {
  _id: string | ObjectId;
  userId: string | ObjectId;
  trainerId: string | ObjectId;
  unreadCount: number;
  stripeSubscriptionStatus: string;
  lastMessage: IChat | null;
  createdAt: Date;
  updatedAt: Date;
}

interface UserTrainerData {
  fname: string;
  lname: string;
  email: string;
  profilePic: string;
  isBlocked: boolean;
}

export interface UserChatList extends BaseChatList {
  subscribedTrainerData: UserTrainerData;
}

export interface TrainerChatList extends BaseChatList {
  subscribedUserData: UserTrainerData;
}

export interface Conversation {
  _id: ObjectId;
  userId: ObjectId;
  trainerId: ObjectId;
  lastMessage: IChat | null;
  unreadCount: number;
  stripeSubscriptionStatus: string;
}
