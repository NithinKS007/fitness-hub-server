import {
  CustomUserDashBoardQueryDTO,
  GetWorkoutQueryDTO,
} from "../../application/dtos/query-dtos";
import { PaginationDTO } from "../../application/dtos/utility-dtos";
import { WorkoutdbDTO } from "../../application/dtos/workout-dtos";
import { Workout, WorkoutChartData } from "../entities/workout.entities";

export interface IWorkoutRepository {
  addWorkout(createWorkout: WorkoutdbDTO[]): Promise<Workout[]>;
  getWorkoutsByUserId(
    userId: string,
    searchFilterQuery: GetWorkoutQueryDTO
  ): Promise<{ workoutList: Workout[]; paginationData: PaginationDTO }>;
  deleteWorkoutSet(setId: string): Promise<Workout | null>;
  markAsCompleted(setId: string): Promise<Workout | null>;
  getUserDashBoardChartData(
    searchFilterQuery: CustomUserDashBoardQueryDTO
  ): Promise<WorkoutChartData[]>;
  getTotalWorkoutTime(userId: string): Promise<number>;
  getTodaysTotalPendingWorkouts(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<number>;
  getTodaysTotalCompletedWorkouts(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<number>;
  getWorkoutBySetId(setId: string): Promise<Workout | null>;
}
