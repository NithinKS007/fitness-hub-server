import { IVideoCallLog } from "@domain/entities/video-calllog.entity";
import mongoose, { Schema } from "mongoose";

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
