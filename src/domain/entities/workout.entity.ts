export interface Workout {
  id: string;
  userId: string;
  date: Date;
  bodyPart: string;
  exerciseName: string;
  kg: number;
  reps: number;
  time: number;
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
