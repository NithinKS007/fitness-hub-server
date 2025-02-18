import mongoose, { Schema, Document } from "mongoose";

interface IPasswordResetToken extends Document {
  email: string; 
  resetToken: string;
  resetTokenCreatedAt: Date;
}
const passwordResetTokenSchema: Schema = new Schema(
  {
    email: { type: String, required: true }, 
    resetToken: { type: String, required: true }, 
    resetTokenCreatedAt: { type: Date, required: true},
  },
  { timestamps: true }
);
passwordResetTokenSchema.index({ resetTokenCreatedAt: 1 }, { expireAfterSeconds: 120 });

const PasswordResetTokenModel = mongoose.model<IPasswordResetToken>("PasswordResetToken", passwordResetTokenSchema);

export default PasswordResetTokenModel;
