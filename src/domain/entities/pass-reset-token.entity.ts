import { Document, ObjectId } from "mongoose";

export interface IPasswordResetToken extends Document {
  _id: ObjectId;
  email: string;
  resetToken: string;
  resetTokenCreatedAt: Date;
}
