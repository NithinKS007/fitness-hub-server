import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface IOtp extends Document {
  _id: ObjectId;
  email: string;
  otp: string;
}

const otpSchema: Schema = new Schema(
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
    otp: { type: String, required: true },
  },
  { timestamps: true }
);

otpSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 });

const OtpModel = mongoose.model<IOtp>("Otp", otpSchema);

export default OtpModel;
