import mongoose, { Schema, Document } from "mongoose";

export interface IConversation extends Document {
  _id: mongoose.Schema.Types.ObjectId;
  userId: mongoose.Schema.Types.ObjectId;
  trainerId: mongoose.Schema.Types.ObjectId;
  lastMessage: mongoose.Schema.Types.ObjectId | null;
  unreadCount: number;
  stripeSubscriptionStatus: string;
}

const conversationSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    trainerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trainer",
      required: true,
    },
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      default: null,
    },
    unreadCount: { type: Number, default: 0 },
    stripeSubscriptionStatus: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const conversationModel = mongoose.model<IConversation>(
  "Conversation",
  conversationSchema
);

export default conversationModel;
