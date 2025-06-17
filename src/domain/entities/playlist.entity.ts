import mongoose, { Document } from "mongoose";

export interface IPlayList extends Document {
  _id: mongoose.Schema.Types.ObjectId;
  trainerId: string | mongoose.Schema.Types.ObjectId;
  title: string;
  videoCount: number;
  privacy: boolean;
}
