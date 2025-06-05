import {
  CustomUserDashBoardQueryDTO,
  GetWorkoutQueryDTO,
} from "../../application/dtos/query-dtos";
import { PaginationDTO } from "../../application/dtos/utility-dtos";
import { IWorkout } from "../../infrastructure/databases/models/workout.model";
import { WorkoutChartData } from "../entities/workout.entities";
import { IBaseRepository } from "./IBaseRepository";

export interface IWorkoutRepository extends IBaseRepository<IWorkout> {
  getWorkoutsByUserId(
    userId: string,
    searchFilterQuery: GetWorkoutQueryDTO
  ): Promise<{ workoutList: IWorkout[]; paginationData: PaginationDTO }>;
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
}
