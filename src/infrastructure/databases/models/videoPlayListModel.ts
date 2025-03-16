import mongoose, { Schema, Document } from "mongoose";

interface IPlaylist extends Document {
  _id: mongoose.Schema.Types.ObjectId;
  trainerId: mongoose.Schema.Types.ObjectId;
  title: string;
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
    privacy: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const playlistModel = mongoose.model<IPlaylist>("Playlist", playlistSchema);

export default playlistModel;
