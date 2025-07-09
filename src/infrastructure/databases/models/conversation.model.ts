import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface IConversation extends Document {
  _id: ObjectId;
  userId: string | ObjectId;
  trainerId: string | ObjectId;
  lastMessage: string | ObjectId;
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
        return typeof value === "string" &&
          mongoose.Types.ObjectId.isValid(value)
          ? new mongoose.Types.ObjectId(value)
          : (() => {
              throw new Error("Please provide a valid user id");
            })();
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
          : (() => {
              throw new Error("Please provide a valid trainer id");
            })();
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
          : (() => {
              throw new Error("Please provide a valid lastmessage id");
            })();
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
