import { IWorkoutRepository } from "../../../domain/interfaces/IWorkoutRepository";
import { validationError } from "../../../presentation/middlewares/error.middleware";
import { WorkoutStatus } from "../../../shared/constants/index.constants";
import { WorkoutdbDTO, WorkoutDTO } from "../../dtos/workout-dtos";
import { IWorkout } from "../../../infrastructure/databases/models/workout.model";

/**
 * Purpose: Create a new workout by adding multiple workout sets for the user on a specific date.
 * Incoming: 
 *    - { userId } (The ID of the user performing the workout)
 *    - { date } (The date of the workout session)
 *    - { workouts } (The workout details containing exercises and sets)
 * Returns: { addedWorkouts } (Array of newly created workout sets)
 * Throws: Error if workout creation fails or if the data is invalid.
 */

export class CreateWorkoutUseCase {
  constructor(private workoutRepository: IWorkoutRepository) {}
  async execute(
    userId: string,
    { date, workouts }: WorkoutDTO
  ): Promise<IWorkout[]> {
    const workoutDate = new Date(date);
    const workoutItems: WorkoutdbDTO[] = Object.entries(workouts).flatMap(
      ([bodyPart, workout]: [string, any]) =>
        workout.exercises.flatMap((exercise: any) =>
          exercise.sets.map((set: any) => ({
            userId: userId,
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

    const addedWorkouts = await Promise.all(
      workoutItems.map(async (item) => {
        return await this.workoutRepository.create(item);
      })
    );

    if (!addedWorkouts) {
      throw new validationError(WorkoutStatus.FailedToAddWorkout);
    }
    return addedWorkouts;
  }
}
