import mongoose, { Schema, Document } from "mongoose";

export interface IChat extends Document {
  _id: mongoose.Schema.Types.ObjectId;
  senderId: string | mongoose.Schema.Types.ObjectId;
  receiverId: string | mongoose.Schema.Types.ObjectId;
  message: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const chatSchema: Schema = new Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
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
      set: (value: string) => {
        return typeof value === "string" &&
          mongoose.Types.ObjectId.isValid(value)
          ? new mongoose.Types.ObjectId(value)
          : value;
      },
    },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const ChatModel = mongoose.model<IChat>("Chat", chatSchema);

export default ChatModel;
