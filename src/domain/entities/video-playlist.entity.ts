import mongoose, { Document } from "mongoose";

export interface IVideoPlaylist extends Document {
  _id: mongoose.Schema.Types.ObjectId;
  videoId: mongoose.Schema.Types.ObjectId | string;
  playlistId: mongoose.Schema.Types.ObjectId | string;
}
