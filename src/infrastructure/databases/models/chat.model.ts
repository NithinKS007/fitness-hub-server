import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface IChat extends Document {
  _id: ObjectId;
  senderId: ObjectId;
  receiverId: ObjectId;
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
        if (mongoose.Types.ObjectId.isValid(value)) {
          return new mongoose.Types.ObjectId(value);
        } else {
          throw new Error("Please provide a valid sender id");
        }
      },
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      set: (value: string) => {
        if (mongoose.Types.ObjectId.isValid(value)) {
          return new mongoose.Types.ObjectId(value);
        } else {
          throw new Error("Please provide a valid receiver id");
        }
      },
    },
    message: {
      type: String,
      required: true,
      minlength: [1, "Message must contain at least 1 character"],
      maxlength: [500, "Message cannot be longer than 500 characters"],
    },
    isRead: { type: Boolean, default: false, required: true },
  },
  { timestamps: true }
);

const ChatModel = mongoose.model<IChat>("Chat", chatSchema);

export default ChatModel;
