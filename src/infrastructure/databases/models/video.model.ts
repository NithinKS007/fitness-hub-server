import { IVideo } from "@domain/entities/video.entity";
import mongoose, { Schema } from "mongoose";

const videoSchema: Schema = new Schema(
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
    title: { type: String, required: true },
    description: { type: String, required: true },
    duration: { type: Number, required: true },
    thumbnail: { type: String, required: true },
    video: { type: String, required: true },
    privacy: { type: Boolean, default: false },
  },
  { timestamps: true }
);
videoSchema.index({ trainerId: 1, title: 1 });

const VideoModel = mongoose.model<IVideo>("Video", videoSchema);

export default VideoModel;
