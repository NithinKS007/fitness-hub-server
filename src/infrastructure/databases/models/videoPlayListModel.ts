import mongoose, { Schema, Document } from "mongoose";

interface IVideoPlaylist extends Document {
  videoId: mongoose.Schema.Types.ObjectId;
  playlistId: mongoose.Schema.Types.ObjectId;
}

const videoPlaylistSchema: Schema = new Schema(
  {
    videoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
      required: true,
    },
    playListId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Playlist",
      required: true,
    },
  },
  { timestamps: true }
);
videoPlaylistSchema.index({ videoId: 1, playlistId: 1 });
videoPlaylistSchema.index({ playlistId: 1, videoId: 1 });
const videoPlayListModel = mongoose.model<IVideoPlaylist>(
  "VideoPlaylist",
  videoPlaylistSchema
);

export default videoPlayListModel;
