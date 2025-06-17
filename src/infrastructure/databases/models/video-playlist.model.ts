import { IVideoPlaylist } from "@domain/entities/video-playlist.entity";
import mongoose, { Schema } from "mongoose";

const videoPlaylistSchema: Schema = new Schema(
  {
    videoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
      required: true,
      set: (value: string) => {
        return typeof value === "string" &&
          mongoose.Types.ObjectId.isValid(value)
          ? new mongoose.Types.ObjectId(value)
          : value;
      },
    },
    playListId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Playlist",
      required: true,
      set: (value: string) => {
        return typeof value === "string" &&
          mongoose.Types.ObjectId.isValid(value)
          ? new mongoose.Types.ObjectId(value)
          : value;
      },
    },
  },
  { timestamps: true }
);
videoPlaylistSchema.index({ videoId: 1, playlistId: 1 });
videoPlaylistSchema.index({ playlistId: 1, videoId: 1 });
const VideoPlayListModel = mongoose.model<IVideoPlaylist>(
  "VideoPlaylist",
  videoPlaylistSchema
);

export default VideoPlayListModel;
