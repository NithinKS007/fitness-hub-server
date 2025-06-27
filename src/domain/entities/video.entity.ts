import { Document, ObjectId } from "mongoose";

export interface IVideo extends Document {
  _id: ObjectId;
  trainerId: string | ObjectId;
  title: string;
  description: string;
  duration: Number;
  thumbnail: string;
  video: string;
  privacy: boolean;
}
