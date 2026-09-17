import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface IConversation extends Document {
  _id: ObjectId;
  userId: ObjectId;
  trainerId: ObjectId;
  lastMessage: ObjectId;
  unreadCount: number;
  stripeSubscriptionStatus: string;
}

const conversationSchema: Schema = new Schema(
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
      ref: "Trainer",
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
      ref: "Chat",
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
    stripeSubscriptionStatus: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const ConversationModel = mongoose.model<IConversation>(
  "Conversation",
  conversationSchema
);

export default ConversationModel;
