import mongoose, { Schema, Document } from "mongoose";

interface IVideo extends Document {
  _id: mongoose.Schema.Types.ObjectId;
  trainerId: mongoose.Schema.Types.ObjectId;
  title: string;
  description: string;
  duration:Number
  thumbnail: string;
  video: string;
  privacy: boolean;
  playLists: mongoose.Schema.Types.ObjectId[];
}

const videoSchema: Schema = new Schema(
  {
    trainerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trainer",
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    duration: { type: Number, required: true },
    thumbnail: { type: String, required: true},
    video: { type: String, required: true},
    privacy: { type: Boolean, default: false},
  },
  { timestamps: true }
);

const videoModel = mongoose.model<IVideo>("Video", videoSchema);

export default videoModel;
