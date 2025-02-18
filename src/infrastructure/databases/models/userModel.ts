import mongoose, { Schema, Document } from "mongoose";

interface IUser extends Document {
  _id: string;
  fname: string;
  lname: string;
  email: string;
  password: string;
  isBlocked: boolean;
  role: "user" | "trainer" | "admin";
  otpVerified?: boolean;
  googleVerified?: boolean;
  phone?: string;
  dateOfBirth?: Date;
  profilePic?: string;
  age?: string;
  height?: string;
  weight?: string;
  gender: "male" | "female" 
  trainerData?: {
    yearsOfExperience?: string;
    specializations?: string[];
    certifications?: { fileName: string; url: string }[];
    isApproved?: boolean;
    aboutMe?: string;
  };
  medicalDetails?: {
    bloodGroup?: string;
    medicalConditions?: string;
    otherConcerns?: string;
  };
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
    isBlocked: { type: Boolean, default: false },
    otpVerified: { type: Boolean, default: false },
    googleVerified: { type: Boolean, default: false },
    password: { type: String },
    phone: { type: String },
    dateOfBirth: { type: Date },
    profilePic: { type: String },
    age: { type: String },
    height: { type: String },
    weight: { type: String },
    gender: { type: String },
    trainerData: {
      yearsOfExperience: { type: String },
      specializations: [{ type: String }],
      certifications: [{ fileName: String, url: String }],
      isApproved: { type: Boolean, default: false },
      aboutMe: { type: String },
    },
    medicalDetails: {
      bloodGroup: { type: String },
      medicalConditions: { type: String },
      otherConcerns: { type: String },
    },
  },
  { timestamps: true }
);

const userModel = mongoose.model<IUser>("User", userSchema);

export default userModel;
