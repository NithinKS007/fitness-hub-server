import { Document, ObjectId } from "mongoose";

export interface IWorkout extends Document {
  userId: string | ObjectId;
  date: Date;
  bodyPart: string;
  exerciseName: string;
  kg: number;
  reps: number;
  time: number;
  isCompleted: boolean;
}
