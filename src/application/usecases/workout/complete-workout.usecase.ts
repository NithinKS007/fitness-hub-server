import { IWorkoutRepository } from "../../../domain/interfaces/IWorkoutRepository";
import { IWorkout } from "../../../infrastructure/databases/models/workout.model";
import { validationError } from "../../../presentation/middlewares/error.middleware";
import { WorkoutStatus } from "../../../shared/constants/index.constants";

/**
 * Purpose: Complete a workout session by marking it as completed in the database.
 * Incoming: { setId } (The ID of the workout set to be marked as completed)
 * Returns: { completeWorkoutSet } (The updated workout set with completion status)
 * Throws: Error if the workout is not found, if it is a future workout, or if marking completion fails.
 */

export class CompleteWorkoutUseCase {
  constructor(private workoutRepository: IWorkoutRepository) {}
  async execute(setId: string): Promise<IWorkout> {
    const workout = await this.workoutRepository.findById(setId);
    if (!workout) {
      throw new validationError(WorkoutStatus.FailedToGetWorkoutData);
    }
    if (workout.date > new Date()) {
      throw new validationError(WorkoutStatus.cannotCompleteFutureWorkouts);
    }
    const completeWorkoutSet = await this.workoutRepository.update(setId, {
      isCompleted: true,
    });
    if (!completeWorkoutSet) {
      throw new validationError(WorkoutStatus.FailedToMarkCompletionSetStatus);
    }
    return completeWorkoutSet;
  }
}
