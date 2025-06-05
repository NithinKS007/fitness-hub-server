import { ObjectId } from "mongoose";
import { Playlist } from "./playlist.entities";

export interface Video {
  _id: ObjectId;
  trainerId: ObjectId;
  title: string;
  description: string;
  duration: Number;
  thumbnail: string;
  video: string;
}

export interface VideoWithPlayLists extends Video {
  playLists: Playlist[];
}
