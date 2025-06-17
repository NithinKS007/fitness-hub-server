import { IPasswordResetToken } from "@domain/entities/pass-reset-token.entity";
import mongoose, { Schema } from "mongoose";

const passwordResetTokenSchema: Schema = new Schema(
  {
    email: { type: String, required: true },
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
