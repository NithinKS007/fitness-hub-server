import mongoose, { ObjectId } from "mongoose";

export interface Workout {
  userId: mongoose.Schema.Types.ObjectId;
  date: Date;
  bodyPart: string;
  exerciseName: string;
  kg: number;
  reps: number;
  time: number;
  isCompleted: boolean;
}

export interface WorkoutChartData {
  _id: string;
  totalWeight: number;
}
