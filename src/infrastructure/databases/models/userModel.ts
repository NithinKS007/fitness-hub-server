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
    password: { type: String, required: true },
    isBlocked:{type: Boolean,required:true, default: false},
    role: {
      type: String,
      enum: ["user", "trainer", "admin"],
      required: true,
      default: "user",
    },
    otpVerified: { type: Boolean, default: false },
    phone: { type: String },
    dateOfBirth: { type: Date },
    profilePic: { type: String },
  },
  { timestamps: true }
);

const userModel = mongoose.model<IUser>("User", userSchema);

export default userModel;
