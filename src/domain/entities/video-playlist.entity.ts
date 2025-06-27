import { Document, ObjectId } from "mongoose";

export interface IVideoPlaylist extends Document {
  _id: ObjectId;
  videoId: ObjectId | string;
  playlistId: ObjectId | string;
}
