import mongoose, { Schema, Document } from "mongoose";

interface IOtp extends Document {
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

const otpModel = mongoose.model<IOtp>("Otp",otpSchema)

export default otpModel