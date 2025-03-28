import { ObjectId } from "mongoose";
export interface Playlist {
  _id: ObjectId | string;
  trainerId: ObjectId | string;
  title: string;
  videoCount:number
  privacy: boolean;
}
