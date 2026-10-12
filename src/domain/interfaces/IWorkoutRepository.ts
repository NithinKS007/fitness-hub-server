import {
  GetWeightLiftedByDateDTO,
  GetWorkoutsDTO,
} from "@application/dtos/query-dtos";
import { PagedResponse } from "@application/dtos/utility-dtos";
import { Workout } from "@domain/entities/workout.entity";
import { IBaseRepository } from "@domain/interfaces/IBaseRepository";
import { WeightLiftedByDateUILayer } from "@application/dtos/read-models";

export interface IWorkoutRepository extends IBaseRepository<Workout> {
  getWorkouts(dtos: GetWorkoutsDTO): Promise<PagedResponse<Workout>>;
  getWeightLiftedByDate(
    dtos: GetWeightLiftedByDateDTO
  ): Promise<WeightLiftedByDateUILayer[]>;
  getTotalWorkoutTime(userId: string): Promise<number>;
  getTotalPendingWorkouts(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<number>;
  getTotalCompletedWorkouts(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<number>;
}
