import { ObjectId } from "mongoose";

export interface Conversation {
  userId: ObjectId;
  trainerId: ObjectId;
  lastMessage: Ichat | null;
  unreadCount: number;
  stripeSubscriptionStatus: string;
}

export interface Ichat {
  _id: ObjectId;
  senderId: ObjectId;
  receiverId: ObjectId;
  message: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserChatList {
  _id: string | ObjectId;
  userId: string | ObjectId;
  trainerId: string | ObjectId;
  unreadCount: number;
  stripeSubscriptionStatus: string;
  lastMessage: Ichat | null;
  subscribedTrainerData: {
    fname: string;
    lname: string;
    email: string;
    profilePic: string;
    isBlocked: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface TrainerChatList {
  _id: string | ObjectId;
  userId: string | ObjectId;
  trainerId: string | ObjectId;
  unreadCount: number;
  stripeSubscriptionStatus: string;
  lastMessage: Ichat | null;
  subscribedUserData: {
    fname: string;
    lname: string;
    email: string;
    profilePic: string;
    isBlocked: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}
