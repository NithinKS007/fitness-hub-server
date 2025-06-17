import { IConversation } from "@domain/entities/conversation.entity";
import mongoose, { Schema } from "mongoose";

const conversationSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      set: (value: string) => {
        return typeof value === "string" &&
          mongoose.Types.ObjectId.isValid(value)
          ? new mongoose.Types.ObjectId(value)
          : value;
      },
    },
    trainerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trainer",
      required: true,
      set: (value: string) => {
        return typeof value === "string" &&
          mongoose.Types.ObjectId.isValid(value)
          ? new mongoose.Types.ObjectId(value)
          : value;
      },
    },
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      default: null,
      set: (value: string) => {
        return typeof value === "string" &&
          mongoose.Types.ObjectId.isValid(value)
          ? new mongoose.Types.ObjectId(value)
          : value;
      },
    },
    unreadCount: { type: Number, default: 0 },
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
