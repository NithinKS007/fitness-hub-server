export interface RepSet {
  kg: number;
  reps: number;
  time: number;
}

export interface Exercise {
  name: string;
  sets: RepSet[];
}

export interface Workout {
  bodyPart: string;
  exercises: Exercise[];
}

export interface WorkoutDTO {
  userId: string;
  date: string;
  workouts: Workout[];
}

export interface WorkoutdbDTO {
  userId: string;
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

export interface UserDashBoard {
  chartData: WorkoutChartData[];
  totalWorkoutTime: number;
  todaysTotalPendingWorkouts: number;
  todaysTotalCompletedWorkouts: number;
}
