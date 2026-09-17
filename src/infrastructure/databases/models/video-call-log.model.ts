import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface IVideoCallLog extends Document {
  _id: ObjectId;
  appointmentId: ObjectId;
  callerId: ObjectId;
  receiverId: ObjectId;
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
        if (mongoose.Types.ObjectId.isValid(value)) {
          return new mongoose.Types.ObjectId(value);
        } else {
          throw new Error("Please provide a valid appointment id");
        }
      },
    },
    callerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
      set: (value: string) => {
        if (mongoose.Types.ObjectId.isValid(value)) {
          return new mongoose.Types.ObjectId(value);
        } else {
          throw new Error("Please provide a valid caller id");
        }
      },
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Trainer",
      set: (value: string) => {
        if (mongoose.Types.ObjectId.isValid(value)) {
          return new mongoose.Types.ObjectId(value);
        } else {
          throw new Error("Please provide a valid receiver id");
        }
      },
    },
    callDuration: {
      type: Number,
      default: 0,
      validate: {
        validator: (value: number) => value >= 0,
        message: "Call duration must be a positive number",
      },
    },
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
