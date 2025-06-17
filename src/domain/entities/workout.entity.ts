import mongoose, { Document } from "mongoose";

export interface IWorkout extends Document {
  userId: string | mongoose.Schema.Types.ObjectId;
  date: Date;
  bodyPart: string;
  exerciseName: string;
  kg: number;
  reps: number;
  time: number;
  isCompleted: boolean;
}
