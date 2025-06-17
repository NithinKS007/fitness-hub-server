import mongoose, { Document } from "mongoose";

export interface IOtp extends Document {
  _id: mongoose.Schema.Types.ObjectId;
  email: string;
  otp: string;
}
