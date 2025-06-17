import mongoose, { Document } from "mongoose";

export interface IPasswordResetToken extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  resetToken: string;
  resetTokenCreatedAt: Date;
}
