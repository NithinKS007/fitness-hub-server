import {
  CustomUserDashBoardQueryDTO,
  GetWorkoutQueryDTO,
} from "@application/dtos/query-dtos";
import { PaginationDTO } from "@application/dtos/utility-dtos";
import { WorkoutChartData } from "@application/dtos/workout-dtos";
import { IWorkout } from "@domain/entities/workout.entity";
import { IBaseRepository } from "@domain/interfaces/IBaseRepository";

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
