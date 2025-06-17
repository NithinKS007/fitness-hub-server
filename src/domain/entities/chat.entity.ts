import mongoose, { Document } from "mongoose";

export interface IChat extends Document {
  _id: mongoose.Schema.Types.ObjectId;
  senderId: string | mongoose.Schema.Types.ObjectId;
  receiverId: string | mongoose.Schema.Types.ObjectId;
  message: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}
