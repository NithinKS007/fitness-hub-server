import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface IVideoPlaylist extends Document {
  _id: ObjectId;
  videoId: ObjectId;
  playListId: ObjectId;
}

const videoPlaylistSchema: Schema = new Schema(
  {
    videoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
      required: true,
      set: (value: string) => {
        if (mongoose.Types.ObjectId.isValid(value)) {
          return new mongoose.Types.ObjectId(value);
        } else {
          throw new Error("Please provide a valid video id");
        }
      },
    },
    playListId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PlayList",
      required: true,
      set: (value: string) => {
        if (mongoose.Types.ObjectId.isValid(value)) {
          return new mongoose.Types.ObjectId(value);
        } else {
          throw new Error("Please provide a valid playlist id");
        }
      },
    },
  },
  { timestamps: true }
);
videoPlaylistSchema.index({ videoId: 1, playListId: 1 });
videoPlaylistSchema.index({ playListId: 1, videoId: 1 });
const VideoPlayListModel = mongoose.model<IVideoPlaylist>(
  "VideoPlaylist",
  videoPlaylistSchema
);

export default VideoPlayListModel;
