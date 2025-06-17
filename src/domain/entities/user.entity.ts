import mongoose, { Document } from "mongoose";

export interface IUser extends Document {
  _id: mongoose.Schema.Types.ObjectId;
  fname: string;
  lname: string;
  email: string;
  isBlocked: boolean;
  role: "user" | "trainer" | "admin";
  password: string;
  otpVerified: boolean;
  googleVerified: boolean;
  phone: string;
  dateOfBirth: Date;
  profilePic: string;
  age: string;
  height: string;
  weight: string;
  gender: "male" | "female";

  bloodGroup: string;
  medicalConditions: string;
  otherConcerns: string;
}
