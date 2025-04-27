import {
  CustomUserDashBoardQueryDTO,
  GetWorkoutQueryDTO,
} from "../../application/dtos/queryDTOs";
import { IdDTO, PaginationDTO } from "../../application/dtos/utilityDTOs";
import { WorkoutdbDTO } from "../../application/dtos/workoutDTOs";
import { Workout, WorkoutChartData } from "../entities/workout";

export interface IWorkoutRepository {
  addWorkout(createWorkout: WorkoutdbDTO[]): Promise<Workout[]>;
  getWorkoutsByUserId(
    userId: IdDTO,
    searchFilterQuery: GetWorkoutQueryDTO
  ): Promise<{ workoutList: Workout[]; paginationData: PaginationDTO }>;
  deleteWorkoutSet(setId: IdDTO): Promise<Workout | null>;
  markAsCompleted(setId: IdDTO): Promise<Workout | null>;
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
  getWorkoutBySetId(setId: IdDTO): Promise<Workout | null>;
}
