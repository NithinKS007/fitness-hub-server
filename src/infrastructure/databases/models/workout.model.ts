import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface IWorkout extends Document {
  userId: ObjectId;
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
      set: (value: string) => {
        if (mongoose.Types.ObjectId.isValid(value)) {
          return new mongoose.Types.ObjectId(value);
        } else {
          throw new Error("Please provide a valid user id");
        }
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
      min: [1, "Kg must be at least 1"],
    },
    reps: {
      type: Number,
      required: true,
      min: [1, "Reps must be at least 1"],
    },
    time: {
      type: Number,
      required: true,
      min: [1, "Time must be at least 1"],
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
