import mongoose, { Schema, Document } from "mongoose";

interface Ichat extends Document {
  _id: mongoose.Schema.Types.ObjectId;
  senderId: mongoose.Schema.Types.ObjectId;
  receiverId: mongoose.Schema.Types.ObjectId;
  message: string;
  isRead:boolean
  createdAt:Date
  updatedAt:Date
}

const chatSchema: Schema = new Schema(
  {
    senderId: { type: mongoose.Schema.Types.ObjectId, required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, required: true },
    message: { type: String, required: true },
    isRead:{type:Boolean,default:false}
  },
  { timestamps: true }
);

const chatModel = mongoose.model<Ichat>("Chat", chatSchema);

export default chatModel;
