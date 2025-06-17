import mongoose, { Document } from "mongoose";

export interface IVideo extends Document {
  _id: mongoose.Schema.Types.ObjectId;
  trainerId: string | mongoose.Schema.Types.ObjectId;
  title: string;
  description: string;
  duration: Number;
  thumbnail: string;
  video: string;
  privacy: boolean;
}
