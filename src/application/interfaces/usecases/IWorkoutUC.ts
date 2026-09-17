import { WorkoutDTO } from "@application/dtos/workout-dtos";
import { IBaseUseCase } from "./IBase.UC";
import { Workout } from "@domain/entities/workout.entity";
import { GetWorkoutQueryDTO } from "@application/dtos/query-dtos";
import { PaginationDTO } from "@application/dtos/utility-dtos";

export interface ICreateWorkoutUC extends IBaseUseCase<WorkoutDTO, Workout[]> {}
export interface IDeleteWorkoutUC extends IBaseUseCase<string, Workout> {}
export interface ICompleteWorkoutUC extends IBaseUseCase<string, Workout> {}
export interface IGetWorkoutUC
  extends IBaseUseCase<
    GetWorkoutQueryDTO,
    { workoutList: Workout[]; paginationData: PaginationDTO }
  > {}
