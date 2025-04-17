import { ObjectId } from "mongoose";

export interface Conversation {
  userId: ObjectId;
  trainerId: ObjectId;
  lastMessage: string;
  unreadCount: number;
  stripeSubscriptionStatus: string;
}

export interface UserChatList {
  _id: string | ObjectId;
  userId: string | ObjectId;
  trainerId: string | ObjectId;
  lastMessage: string;
  unreadCount: number;
  stripeSubscriptionStatus: string;
  subscribedTrainerData: {
    fname: string;
    lname: string;
    email: string;
    profilePic: string;
    isBlocked: boolean;
  };
}

export interface TrainerChatList {
  _id: string | ObjectId;
  userId: string | ObjectId;
  trainerId: string | ObjectId;
  lastMessage: string;
  unreadCount: number;
  stripeSubscriptionStatus: string;
  subscribedUserData: {
    fname: string;
    lname: string;
    email: string;
    profilePic: string;
    isBlocked: boolean;
  };
}
