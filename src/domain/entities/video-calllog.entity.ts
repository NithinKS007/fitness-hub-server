import mongoose, { Document } from "mongoose";

export interface IVideoCallLog extends Document {
  _id: mongoose.Schema.Types.ObjectId;
  appointmentId: string | mongoose.Schema.Types.ObjectId;
  callerId: string | mongoose.Schema.Types.ObjectId;
  receiverId: string | mongoose.Schema.Types.ObjectId;
  callDuration: number;
  callRoomId: string;
  callStatus: "pending" | "completed" | "missed";
  callStartTime: Date;
  callEndTime: Date;
}
