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
  bloodGroup: string
  medicalConditions: string
  otherConcerns: string
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
  password:{type: String },
  phone: { type: String },
  dateOfBirth: { type: Date },
  profilePic: { type: String },
  age: { type: String },
  height: { type: String },
  weight: { type: String },
  gender: { type: String },
  bloodGroup: { type: String },
  medicalConditions: { type: String },
  otherConcerns: { type: String },
}, { timestamps: true });

const UserModel = mongoose.model<IUser>("User", userSchema);

export default UserModel;
