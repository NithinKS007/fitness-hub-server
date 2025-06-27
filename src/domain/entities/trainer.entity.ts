import { Document, ObjectId } from "mongoose";

export interface ITrainer extends Document {
  _id: string;
  userId: string | ObjectId;
  yearsOfExperience: string;
  specializations: string[];
  certifications: { fileName: string; url: string }[];
  isApproved: boolean;
  aboutMe?: string;
}
