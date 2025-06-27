import { Document, ObjectId } from "mongoose";

export interface IPlayList extends Document {
  _id: ObjectId;
  trainerId: string | ObjectId;
  title: string;
  videoCount: number;
  privacy: boolean;
}
