import { ObjectId } from "mongoose";

export interface Chat {
  _id: ObjectId | string;
  senderId:ObjectId | string;
  receiverId: ObjectId | string;
  message: string;
  isRead:boolean
  createdAt:Date
  updatedAt:Date
}
