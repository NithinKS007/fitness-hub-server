import { IWorkoutRepository } from "../../../domain/interfaces/IWorkoutRepository";
import { IWorkout } from "../../../infrastructure/databases/models/workout.model";
import { validationError } from "../../../presentation/middlewares/error.middleware";
import { WorkoutStatus } from "../../../shared/constants/index.constants";

export class DeleteWorkoutUseCase {
  constructor(private workoutRepository: IWorkoutRepository) {}
  async execute(setId: string): Promise<IWorkout> {
    const deletedWorkoutSet = await this.workoutRepository.delete(setId);
    if (!deletedWorkoutSet) {
      throw new validationError(WorkoutStatus.FailedToDeletWorkoutSet);
    }
    return deletedWorkoutSet;
  }
}
