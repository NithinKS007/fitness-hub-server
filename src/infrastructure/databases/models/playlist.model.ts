import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface IPlayList extends Document {
  _id: ObjectId;
  trainerId: string | ObjectId;
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
        return typeof value === "string" &&
          mongoose.Types.ObjectId.isValid(value)
          ? new mongoose.Types.ObjectId(value)
          : (() => {
              throw new Error("Please provide a valid trainer id");
            })();
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
playListSchema.index({ trainerId: 1, title: "text" });
const PlayListModel = mongoose.model<IPlayList>("PlayList", playListSchema);

export default PlayListModel;
