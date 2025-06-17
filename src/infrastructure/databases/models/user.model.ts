import { IUser } from "@domain/entities/user.entity";
import mongoose, { Schema } from "mongoose";

const userSchema = new Schema<IUser>(
  {
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
    password: { type: String },
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
  },
  { timestamps: true }
);

userSchema.index({ isBlocked: 1, email: 1 });
const UserModel = mongoose.model<IUser>("User", userSchema);

export default UserModel;
