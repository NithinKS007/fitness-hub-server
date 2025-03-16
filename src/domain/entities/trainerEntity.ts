import { ObjectId } from "mongoose";

export interface Trainer {
  fname: string;
  lname: string;
  email: string;
  password: string;
  role: "user" | "admin" | "trainer";
  isBlocked: boolean;
  otpVerified?: boolean;
  googleVerified?: boolean;
  phone?: string;
  dateOfBirth?: Date;
  profilePic?: string;
  age?: string;
  height?: string;
  weight?: string;
  gender?: string;

  _id: string | ObjectId
  userId:string| ObjectId
  yearsOfExperience?: string;
  specializations?: string[];
  certifications?: { fileName: string; url: string }[];
  isApproved?: boolean;
  aboutMe?: string;
}

export interface TrainerSpecific {
  _id:string | ObjectId
  userId:string | ObjectId
  yearsOfExperience: string;
  specializations: string[];
  isApproved:boolean
  certifications: { fileName: string; url: string }[];
  aboutMe?: string;
}
