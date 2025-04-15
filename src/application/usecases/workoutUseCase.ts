import mongoose from "mongoose";
import { Workout } from "../../domain/entities/workoutEntity";
import { IWorkoutRepository } from "../../domain/interfaces/IWorkoutRepository";
import { validationError } from "../../presentation/middlewares/errorMiddleWare";
import { HttpStatusMessages } from "../../shared/constants/httpResponseStructure";
import { GetWorkoutQueryDTO } from "../dtos/queryDTOs";
import { IdDTO, PaginationDTO } from "../dtos/utilityDTOs";
import { WorkoutDBdto, WorkoutDTO } from "../dtos/workoutDTOs";
import { parseDateRange } from "../../shared/utils/dayjs";

export class WorkOutUseCase {
  constructor(private workoutRepository: IWorkoutRepository) {}
  public async addWorkout(
    userId: IdDTO,
    { date, workouts }: WorkoutDTO
  ): Promise<Workout[]> {
    const workoutDate = new Date(date);

    const userObjectId = new mongoose.Types.ObjectId(userId);
    const workoutItems: WorkoutDBdto[] = Object.entries(workouts).flatMap(
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
      throw new validationError(HttpStatusMessages.FailedToAddWorkout);
    }
    return addedWorkout;
  }

  public async getWorkoutsByUserId(
    userId: IdDTO,
    { page, limit, fromDate, toDate, search, filters }: GetWorkoutQueryDTO
  ): Promise<{ workoutList: Workout[]; paginationData: PaginationDTO }> {
    if (!userId) {
      throw new validationError(HttpStatusMessages.IdRequired);
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
      throw new validationError(HttpStatusMessages.FailedToDeletWorkoutSet);
    }

    return deletedWorkoutSet;
  }

  public async markSetAsCompleted(setId: IdDTO): Promise<Workout> {
    const workout = await this.workoutRepository.getWorkoutBySetId(setId);

    if (!workout) {
      throw new validationError(HttpStatusMessages.FailedToGetWorkoutData);
    }
    if (workout.date > new Date()) {
      throw new validationError(
        HttpStatusMessages.cannotCompleteFutureWorkouts
      );
    }
    const completeWorkoutSet = await this.workoutRepository.markAsCompleted(
      setId
    );

    if (!completeWorkoutSet) {
      throw new validationError(
        HttpStatusMessages.FailedToMarkCompletionSetStatus
      );
    }

    return completeWorkoutSet;
  }
}
