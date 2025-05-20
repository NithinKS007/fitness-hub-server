import mongoose from "mongoose";
import { Workout } from "../../../domain/entities/workout";
import { IWorkoutRepository } from "../../../domain/interfaces/IWorkoutRepository";
import { validationError } from "../../../presentation/middlewares/errorMiddleWare";
import {
  AuthStatus,
  WorkoutStatus,
} from "../../../shared/constants/index-constants";
import { GetWorkoutQueryDTO } from "../../dtos/query-dtos";
import { IdDTO, PaginationDTO } from "../../dtos/utility-dtos";
import { WorkoutdbDTO, WorkoutDTO } from "../../dtos/workout-dtos";
import { parseDateRange } from "../../../shared/utils/dayjs";

export class WorkOutUseCase {
  constructor(private workoutRepository: IWorkoutRepository) {}
  public async addWorkout(
    userId: IdDTO,
    { date, workouts }: WorkoutDTO
  ): Promise<Workout[]> {
    const workoutDate = new Date(date);

    const userObjectId = new mongoose.Types.ObjectId(userId);
    const workoutItems: WorkoutdbDTO[] = Object.entries(workouts).flatMap(
      ([bodyPart, workout]: [string, any]) =>
        workout.exercises.flatMap((exercise: any) =>
          exercise.sets.map((set: any) => ({
            userId: userObjectId,
            date: workoutDate,
            bodyPart,
            exerciseName: exercise.name,
            kg: set.kg,
            reps: set.reps,
            time: set.time,
            isCompleted: false,
          }))
        )
    );
    const addedWorkout = await this.workoutRepository.addWorkout(workoutItems);
    if (!addedWorkout) {
      throw new validationError(WorkoutStatus.FailedToAddWorkout);
    }
    return addedWorkout;
  }

  public async getWorkoutsByUserId(
    userId: IdDTO,
    { page, limit, fromDate, toDate, search, filters }: GetWorkoutQueryDTO
  ): Promise<{ workoutList: Workout[]; paginationData: PaginationDTO }> {
    if (!userId) {
      throw new validationError(AuthStatus.IdRequired);
    }
    const { parsedFromDate, parsedToDate } = parseDateRange(fromDate, toDate);

    const { workoutList, paginationData } =
      await this.workoutRepository.getWorkoutsByUserId(userId, {
        page,
        limit,
        fromDate: parsedFromDate,
        toDate: parsedToDate,
        search,
        filters,
      });

    return { workoutList, paginationData };
  }

  public async deleteWorkoutSet(setId: IdDTO): Promise<Workout> {
    const deletedWorkoutSet = await this.workoutRepository.deleteWorkoutSet(
      setId
    );

    if (!deletedWorkoutSet) {
      throw new validationError(WorkoutStatus.FailedToDeletWorkoutSet);
    }

    return deletedWorkoutSet;
  }

  public async markSetAsCompleted(setId: IdDTO): Promise<Workout> {
    const workout = await this.workoutRepository.getWorkoutBySetId(setId);

    if (!workout) {
      throw new validationError(WorkoutStatus.FailedToGetWorkoutData);
    }
    if (workout.date > new Date()) {
      throw new validationError(
        WorkoutStatus.cannotCompleteFutureWorkouts
      );
    }
    const completeWorkoutSet = await this.workoutRepository.markAsCompleted(
      setId
    );

    if (!completeWorkoutSet) {
      throw new validationError(
        WorkoutStatus.FailedToMarkCompletionSetStatus
      );
    }

    return completeWorkoutSet;
  }
}
