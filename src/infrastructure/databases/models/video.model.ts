import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface IVideo extends Document {
  _id: ObjectId;
  trainerId: ObjectId;
  title: string;
  description: string;
  duration: Number;
  thumbnail: string;
  video: string;
  privacy: boolean;
}

const videoSchema: Schema = new Schema(
  {
    trainerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trainer",
      required: true,
      set: (value: string) => {
        if (mongoose.Types.ObjectId.isValid(value)) {
          return new mongoose.Types.ObjectId(value);
        } else {
          throw new Error("Please provide a valid trainer id");
        }
      },
    },
    title: {
      type: String,
      required: true,
      minlength: [3, "Title should be at least 5 characters long"],
      maxlength: [100, "Title cannot be longer than 100 characters"],
    },
    description: {
      type: String,
      required: true,
      minlength: [3, "Description should be at least 10 characters long"],
      maxlength: [500, "Description cannot be longer than 500 characters"],
    },
    duration: {
      type: Number,
      required: true,
      min: [0, "Duration must be a positive number"],
    },
    thumbnail: { type: String, required: true },
    video: { type: String, required: true },
    privacy: { type: Boolean, default: false },
  },
  { timestamps: true }
);
videoSchema.index({ trainerId: 1, title: 1 });

const VideoModel = mongoose.model<IVideo>("Video", videoSchema);

export default VideoModel;
