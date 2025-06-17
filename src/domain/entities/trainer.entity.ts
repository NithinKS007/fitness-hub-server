import mongoose, { Document } from "mongoose";

export interface ITrainer extends Document {
  _id: string;
  userId: string | mongoose.Schema.Types.ObjectId;
  yearsOfExperience: string;
  specializations: string[];
  certifications: { fileName: string; url: string }[];
  isApproved: boolean;
  aboutMe?: string;
}
