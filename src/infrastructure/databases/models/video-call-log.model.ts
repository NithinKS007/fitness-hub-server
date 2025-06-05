import mongoose, { Schema, Document } from "mongoose";

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

const videoCallLogSchema: Schema = new Schema(
  {
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Appointment",
      set: (value: string) => {
        return typeof value === "string" &&
          mongoose.Types.ObjectId.isValid(value)
          ? new mongoose.Types.ObjectId(value)
          : value;
      },
    },
    callerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
      set: (value: string) => {
        return typeof value === "string" &&
          mongoose.Types.ObjectId.isValid(value)
          ? new mongoose.Types.ObjectId(value)
          : value;
      },
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Trainer",
      set: (value: string) => {
        return typeof value === "string" &&
          mongoose.Types.ObjectId.isValid(value)
          ? new mongoose.Types.ObjectId(value)
          : value;
      },
    },
    callDuration: { type: Number, default: 0 },
    callRoomId: { type: String },
    callStatus: {
      type: String,
      enum: ["pending", "completed", "missed"],
      default: "pending",
    },
    callStartTime: { type: Date },
    callEndTime: { type: Date },
  },
  { timestamps: true }
);

const VideoCallLogModel = mongoose.model<IVideoCallLog>(
  "VideoCallLog",
  videoCallLogSchema
);

export default VideoCallLogModel;
