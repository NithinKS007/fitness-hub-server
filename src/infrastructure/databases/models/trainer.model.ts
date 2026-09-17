import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface ITrainer extends Document {
  _id: string;
  userId: ObjectId;
  yearsOfExperience: string;
  specializations: string[];
  certifications: { fileName: string; url: string }[];
  isApproved: boolean;
  aboutMe?: string;
}

const trainerSchema: Schema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      set: (value: string) => {
        if (mongoose.Types.ObjectId.isValid(value)) {
          return new mongoose.Types.ObjectId(value);
        } else {
          throw new Error("Please provide a valid user id.");
        }
      },
    },
    yearsOfExperience: {
      type: String,
      required: true,
      validate: {
        validator: (value: string) => /^[0-9]+$/.test(value),
        message: "Years of experience must be a positive integer",
      },
    },
    specializations: [{ type: String, required: true }],
    certifications: [
      {
        fileName: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],
    isApproved: { type: Boolean, default: false },
    aboutMe: {
      type: String,
      validate: {
        validator: (value: string) => value.length >= 500,
        message: "About Me text should not exceed 500 characters",
      },
    },
  },
  { timestamps: true }
);

trainerSchema.index({ userId: 1 });

const TrainerModel = mongoose.model<ITrainer>("Trainer", trainerSchema);

export default TrainerModel;
