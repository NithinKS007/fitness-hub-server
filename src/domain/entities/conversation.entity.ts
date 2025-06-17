import mongoose, { Document } from "mongoose";

export interface IConversation extends Document {
  _id: mongoose.Schema.Types.ObjectId;
  userId: string | mongoose.Schema.Types.ObjectId;
  trainerId: string | mongoose.Schema.Types.ObjectId;
  lastMessage: string | mongoose.Schema.Types.ObjectId;
  unreadCount: number;
  stripeSubscriptionStatus: string;
}
