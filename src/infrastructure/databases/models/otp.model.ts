import mongoose, { Schema, Document } from "mongoose";

export interface IOtp extends Document {
  email: string;
  otp: string;
}
const otpSchema: Schema = new Schema(
  {
    email: { type: String, required: true },
    otp: { type: String, required: true },
  },
  { timestamps: true }
);

otpSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 });

const otpModel = mongoose.model<IOtp>("Otp", otpSchema);

export default otpModel;
