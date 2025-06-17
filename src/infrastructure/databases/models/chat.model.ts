import { IChat } from "@domain/entities/chat.entity";
import mongoose, { Schema } from "mongoose";


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
