import { Document, ObjectId } from "mongoose";

export interface IChat extends Document {
  _id: ObjectId;
  senderId: string | ObjectId;
  receiverId: string | ObjectId;
  message: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}
