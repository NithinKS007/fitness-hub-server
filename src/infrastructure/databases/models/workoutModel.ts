import mongoose, { Schema, Document } from "mongoose";

interface IWorkout extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  date: Date;
  bodyPart: string;
  exerciseName: string;
  kg: number;
  reps: number;
  time: number;
  isCompleted: boolean;
}

const WorkoutSchema: Schema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    bodyPart: {
      type: String,
      required: true,
    },
    exerciseName: {
      type: String,
      required: true,
    },
    kg: {
      type: Number,
      required: true,
    },
    reps: {
      type: Number,
      required: true,
    },
    time: {
      type: Number,
      required: true,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const WorkoutModel = mongoose.model<IWorkout>("Workout", WorkoutSchema);
export default WorkoutModel;
