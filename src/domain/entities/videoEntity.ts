import { ObjectId } from "mongoose";
import { Playlist } from "./playListEntity";

export interface Video {
  _id: string | ObjectId;
  trainerId: string | ObjectId;
  title: string;
  description: string;
  duration: Number;
  thumbnail: string;
  video: string;
}

export interface VideoWithPlayLists extends Video {
  playLists: Playlist[];
}
