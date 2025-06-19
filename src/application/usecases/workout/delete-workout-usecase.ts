import { IWorkout } from "@domain/entities/workout.entity";
import { IWorkoutRepository } from "@domain/interfaces/IWorkoutRepository";
import { validationError } from "@presentation/middlewares/error.middleware";
import { WorkoutStatus } from "@shared/constants/index.constants";
import { TYPES_REPOSITORIES } from "di/types-repositories";
import { injectable, inject } from "inversify";

/**
 * Purpose: Handle the deletion of a specific workout set by its ID.
 * Incoming: { setId } - The unique identifier for the workout set to be deleted.
 * Returns: IWorkout - The deleted workout set object.
 * Throws: validationError if the workout set with the given ID cannot be deleted.
 */

@injectable()
export class DeleteWorkoutUseCase {
  constructor(
    @inject(TYPES_REPOSITORIES.WorkoutRepository)
    private workoutRepository: IWorkoutRepository
  ) {}
  
  async execute(setId: string): Promise<IWorkout> {
    const deletedWorkoutSet = await this.workoutRepository.delete(setId);
    if (!deletedWorkoutSet) {
      throw new validationError(WorkoutStatus.FailedToDelete);
    }
    return deletedWorkoutSet;
  }
}
