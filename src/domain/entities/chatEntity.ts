import { ObjectId } from "mongoose";

export interface Chat {
  _id: ObjectId | string;
  senderId: string;
  receiverId: string;
  message: string;
  isRead:boolean
  createdAt:Date
}
