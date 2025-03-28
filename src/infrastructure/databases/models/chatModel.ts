import mongoose, { Schema, Document } from "mongoose";

interface Ichat extends Document {
  _id: mongoose.Schema.Types.ObjectId;
  senderId: string;
  receiverId: string;
  message: string;
  createdAt:Date
}

const chatSchema: Schema = new Schema(
  {
    senderId: { type: String, required: true },
    receiverId: { type: String, required: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

const chatModel = mongoose.model<Ichat>("Chat", chatSchema);

export default chatModel;
