import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  _id:string
  fname: string;
  lname: string;
  email: string;
  isBlocked: boolean;
  role: "user" | "trainer" | "admin";
  password:string
  otpVerified: boolean;
  googleVerified: boolean;
  phone: string;
  dateOfBirth: Date;
  profilePic: string;
  age: string;
  height: string;
  weight: string;
  gender: "male" | "female";
}

const userSchema = new Schema<IUser>({
  fname: { type: String, required: true },
  lname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  isBlocked: { type: Boolean, default: false },
  role: {
    type: String,
    enum: ["user", "trainer", "admin"],
    required: true,
    default: "user",
  },
  otpVerified: { type: Boolean, default: false },
  googleVerified: { type: Boolean, default: false },
  password:{type: String, default: null },
  phone: { type: String, default: null },
  dateOfBirth: { type: Date, default: null },
  profilePic: { type: String, default: null },
  age: { type: String, default: null },
  height: { type: String, default: null },
  weight: { type: String, default: null },
  gender: { type: String, default: null },
}, { timestamps: true });

const UserModel = mongoose.model<IUser>("User", userSchema);

export default UserModel;
