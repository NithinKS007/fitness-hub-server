import mongoose from "mongoose";
import { Workout } from "../../../domain/entities/workout.entities";
import { IWorkoutRepository } from "../../../domain/interfaces/IWorkoutRepository";
import { validationError } from "../../../presentation/middlewares/error.middleware";
import { WorkoutStatus } from "../../../shared/constants/index.constants";
import { WorkoutdbDTO, WorkoutDTO } from "../../dtos/workout-dtos";

export class CreateWorkoutUseCase {
  constructor(private workoutRepository: IWorkoutRepository) {}
  async addWorkout(
    userId: string,
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
}
