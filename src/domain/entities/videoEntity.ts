import { ObjectId } from "mongoose";

export interface Video {
  _id: string | ObjectId
  trainerId: string | ObjectId
  title: string;
  description: string;
  duration:Number
  thumbnail: string;
  video: string;
  playLists: string | ObjectId[];
}
