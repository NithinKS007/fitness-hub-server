import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface IChat extends Document {
  _id: ObjectId;
  senderId: string | ObjectId;
  receiverId: string | ObjectId;
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
          : (() => {
              throw new Error("Please provide a valid sender id");
            })();
      },
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      set: (value: string) => {
        return typeof value === "string" &&
          mongoose.Types.ObjectId.isValid(value)
          ? new mongoose.Types.ObjectId(value)
          : (() => {
              throw new Error("Please provide a valid receiver id");
            })();
      },
    },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const ChatModel = mongoose.model<IChat>("Chat", chatSchema);

export default ChatModel;
