import mongoose, { Schema, Document } from "mongoose";

interface IPlayList extends Document {
  _id: mongoose.Schema.Types.ObjectId;
  trainerId: mongoose.Schema.Types.ObjectId;
  title: string;
  videoCount:number
  privacy: boolean;
}

const playlistSchema: Schema = new Schema(
  {
    trainerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trainer",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    videoCount:{
      type:Number,
      default:0,
      required:true
    },
    privacy: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const playListModel = mongoose.model<IPlayList>("PlayList", playlistSchema);

export default playListModel;
