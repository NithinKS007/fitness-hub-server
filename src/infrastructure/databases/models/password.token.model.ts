import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface IPasswordResetToken extends Document {
  _id: ObjectId;
  email: string;
  resetToken: string;
  resetTokenCreatedAt: Date;
}

const passwordResetTokenSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        message: "Please provide a valid email address",
      },
    },
    resetToken: { type: String, required: true },
    resetTokenCreatedAt: { type: Date, required: true },
  },
  { timestamps: true }
);
passwordResetTokenSchema.index(
  { resetTokenCreatedAt: 1 },
  { expireAfterSeconds: 120 }
);

const PasswordResetTokenModel = mongoose.model<IPasswordResetToken>(
  "PasswordResetToken",
  passwordResetTokenSchema
);

export default PasswordResetTokenModel;
