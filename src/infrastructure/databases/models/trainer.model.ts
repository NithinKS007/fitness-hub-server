import mongoose, { Schema, Document } from "mongoose";

export interface ITrainer extends Document {
  _id: string;
  userId: string | mongoose.Schema.Types.ObjectId;
  yearsOfExperience: string;
  specializations: string[];
  certifications: { fileName: string; url: string }[];
  isApproved: boolean;
  aboutMe?: string;
}

const trainerSchema = new Schema<ITrainer>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      set: (value: string) => {
        return typeof value === "string" &&
          mongoose.Types.ObjectId.isValid(value)
          ? new mongoose.Types.ObjectId(value)
          : value;
      },
    },
    yearsOfExperience: { type: String, required: true },
    specializations: [{ type: String, required: true }],
    certifications: [
      {
        fileName: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],
    isApproved: { type: Boolean, default: false },
    aboutMe: { type: String },
  },
  { timestamps: true }
);

trainerSchema.index({ userId: 1 });

const TrainerModel = mongoose.model<ITrainer>("Trainer", trainerSchema);

export default TrainerModel;
