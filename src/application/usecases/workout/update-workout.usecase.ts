import { Workout } from "../../../domain/entities/workout.entities";
import { IWorkoutRepository } from "../../../domain/interfaces/IWorkoutRepository";
import { validationError } from "../../../presentation/middlewares/error.middleware";
import { WorkoutStatus } from "../../../shared/constants/index.constants";

export class UpdateWorkoutUseCase {
  constructor(private workoutRepository: IWorkoutRepository) {}
  async deleteWorkoutSet(setId: string): Promise<Workout> {
    const deletedWorkoutSet = await this.workoutRepository.deleteWorkoutSet(
      setId
    );
    if (!deletedWorkoutSet) {
      throw new validationError(WorkoutStatus.FailedToDeletWorkoutSet);
    }
    return deletedWorkoutSet;
  }

  async markSetAsCompleted(setId: string): Promise<Workout> {
    const workout = await this.workoutRepository.getWorkoutBySetId(setId);
    if (!workout) {
      throw new validationError(WorkoutStatus.FailedToGetWorkoutData);
    }
    if (workout.date > new Date()) {
      throw new validationError(WorkoutStatus.cannotCompleteFutureWorkouts);
    }
    const completeWorkoutSet = await this.workoutRepository.markAsCompleted(
      setId
    );
    if (!completeWorkoutSet) {
      throw new validationError(WorkoutStatus.FailedToMarkCompletionSetStatus);
    }
    return completeWorkoutSet;
  }
}
