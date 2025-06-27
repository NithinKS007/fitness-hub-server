import { Document, ObjectId } from "mongoose";

export interface IVideoCallLog extends Document {
  _id: ObjectId;
  appointmentId: string | ObjectId;
  callerId: string | ObjectId;
  receiverId: string | ObjectId;
  callDuration: number;
  callRoomId: string;
  callStatus: "pending" | "completed" | "missed";
  callStartTime: Date;
  callEndTime: Date;
}
