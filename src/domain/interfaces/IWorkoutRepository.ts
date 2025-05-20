import {
  CustomUserDashBoardQueryDTO,
  GetWorkoutQueryDTO,
} from "../../application/dtos/query-dtos";
import { IdDTO, PaginationDTO } from "../../application/dtos/utility-dtos";
import { WorkoutdbDTO } from "../../application/dtos/workout-dtos";
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
