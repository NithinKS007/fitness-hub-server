import mongoose, { Schema, Document } from "mongoose";

interface IUser extends Document {
  id: string;
  fname: string;
  lname: string;
  email: string;
  password: string;
  isBlocked:boolean
  role: "user" | "trainer" | "admin";
  otpVerified?: boolean;
  phone?: string;
  dateOfBirth?: Date;
  profilePic?: string;
}

const userSchema: Schema = new Schema(
  {
    fname: { type: String, required: true },
    lname: { type: String, required: true },
    email: { type: String, required: true },
    role: {
      type: String,
      enum: ["user", "trainer", "admin"],
      required: true,
      default: "user",
    },
    isBlocked:{type: Boolean,default: false},
    otpVerified: { type: Boolean, default: false },
    googleVerified:{type: Boolean, default: false },
    password: { type: String},
    phone: { type: String },
    dateOfBirth: { type: Date },
    profilePic: { type: String },
  },
  { timestamps: true }
);

const userModel = mongoose.model<IUser>("User", userSchema);

export default userModel;
