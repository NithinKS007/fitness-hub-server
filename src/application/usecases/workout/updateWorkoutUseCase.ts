import { Workout } from "../../../domain/entities/workout";
import { IWorkoutRepository } from "../../../domain/interfaces/IWorkoutRepository";
import { validationError } from "../../../presentation/middlewares/errorMiddleWare";
import { WorkoutStatus } from "../../../shared/constants/index-constants";
import { IdDTO } from "../../dtos/utility-dtos";

export class UpdateWorkoutUseCase {
  constructor(private workoutRepository: IWorkoutRepository) {}
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
