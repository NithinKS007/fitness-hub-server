import { IPlayList } from "@domain/entities/playlist.entity";
import mongoose, { Schema } from "mongoose";

const playlistSchema: Schema = new Schema(
  {
    trainerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trainer",
      required: true,
      set: (value: string) => {
        return typeof value === "string" &&
          mongoose.Types.ObjectId.isValid(value)
          ? new mongoose.Types.ObjectId(value)
          : value;
      },
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    videoCount: {
      type: Number,
      default: 0,
      required: true,
    },
    privacy: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
playlistSchema.index({ trainerId: 1, title: "text" });
const PlayListModel = mongoose.model<IPlayList>("PlayList", playlistSchema);

export default PlayListModel;
