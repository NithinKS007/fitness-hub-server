import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface IPlayList extends Document {
  _id: ObjectId;
  trainerId: ObjectId;
  title: string;
  videoCount: number;
  privacy: boolean;
}

const playListSchema: Schema = new Schema(
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
      trim: true,
      validate: {
        validator: (value: string) => {
          return value.trim().length > 0;
        },
        message: "Playlist title cannot be empty",
      },
    },
    videoCount: {
      type: Number,
      default: 0,
      required: true,
       validate: {
        validator: function (value: number) {
          return Number.isInteger(value) && value >= 0;
        },
        message: "Video count must be a non-negative integer",
      },
    },
    privacy: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
playListSchema.index({ trainerId: 1, title: "text" });
const PlayListModel = mongoose.model<IPlayList>("PlayList", playListSchema);

export default PlayListModel;
