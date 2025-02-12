import mongoose, { Schema, Document } from "mongoose";

interface IUser extends Document {
  fname: string;
  lname: string;
  email: string;
  password: string;
  isBlocked:boolean
  role: "user" | "trainer" | "admin";
  otpVerified?: boolean;
  googleVerified?:boolean
  phone?: string;
  dateOfBirth?: Date;
  profilePic?: string;
  trainerData?: {
    yearsOfExperience?: string;
    specializations?: string[];
    certifications?: string [];
    isApproved?: boolean; 
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
    isBlocked:{type: Boolean,default: false},
    otpVerified: { type: Boolean, default: false },
    googleVerified:{type: Boolean, default: false },
    password: { type: String},
    phone: { type: String },
    dateOfBirth: { type: Date },
    profilePic: { type: String },
    trainerData: {
      yearsOfExperience: { type: String },
      specializations: [{ type: String }],
      certifications: [{ type: String }],
      isApproved:{type: Boolean, default: false }
    },
  },
  { timestamps: true }
);

const userModel = mongoose.model<IUser>("User", userSchema);

export default userModel;
