import { IOtp } from "@domain/entities/otp.entity";
import mongoose, { Schema } from "mongoose";

const otpSchema: Schema = new Schema(
  {
    email: { type: String, required: true },
    otp: { type: String, required: true },
  },
  { timestamps: true }
);

otpSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 });

const OtpModel = mongoose.model<IOtp>("Otp", otpSchema);

export default OtpModel;
