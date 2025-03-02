import mongoose, { Schema, Document } from "mongoose";

export interface ITrainer extends Document {
  _id:string
  userId: mongoose.Schema.Types.ObjectId;
  yearsOfExperience: string;
  specializations: string[];
  certifications: { fileName: string; url: string }[];
  isApproved: boolean;
  aboutMe?: string;
}

const trainerSchema = new Schema<ITrainer>({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
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
  aboutMe: { type: String, default: null },
}, { timestamps: true });

const TrainerModel = mongoose.model<ITrainer>("Trainer", trainerSchema);

export default TrainerModel;
