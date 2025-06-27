import { Document, ObjectId } from "mongoose";

export interface IConversation extends Document {
  _id: ObjectId;
  userId: string | ObjectId;
  trainerId: string | ObjectId;
  lastMessage: string | ObjectId;
  unreadCount: number;
  stripeSubscriptionStatus: string;
}
