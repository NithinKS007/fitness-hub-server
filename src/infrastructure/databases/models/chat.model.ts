import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface IChat extends Document {
  _id: ObjectId;
  userId: ObjectId;
  trainerId: ObjectId;
  lastMessage: ObjectId;
  unreadCount: number;
  providerSubStatus: string;
  createdAt: Date;
  updatedAt: Date;
}

const chatSchema: Schema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      set: (value: string) => {
        if (mongoose.Types.ObjectId.isValid(value)) {
          return new mongoose.Types.ObjectId(value);
        } else {
          throw new Error("Please provide a valid user id");
        }
      },
    },
    trainerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      set: (value: string) => {
        if (mongoose.Types.ObjectId.isValid(value)) {
          return new mongoose.Types.ObjectId(value);
        } else {
          throw new Error("Please provide a valid trainer id");
        }
      },
    },
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null,
      set: (value: string) => {
        if (mongoose.Types.ObjectId.isValid(value)) {
          return new mongoose.Types.ObjectId(value);
        } else {
          throw new Error("Please provide a valid lastmessage id");
        }
      },
    },
    unreadCount: {
      type: Number,
      default: 0,
      validate: {
        validator: (value: number) => {
          return value >= 0;
        },
        message: "Unread count cannot be negative",
      },
    },
    providerSubStatus: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const ChatModel = mongoose.model<IChat>(
  "Chat",
  chatSchema
);

export default ChatModel;
