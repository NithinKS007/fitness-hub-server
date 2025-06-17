import { IWorkout } from "@domain/entities/workout.entity";
import mongoose, { Schema } from "mongoose";

const WorkoutSchema: Schema = new Schema(
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

WorkoutSchema.index({ userId: 1, isCompleted: 1 });

const WorkoutModel = mongoose.model<IWorkout>("Workout", WorkoutSchema);
export default WorkoutModel;
