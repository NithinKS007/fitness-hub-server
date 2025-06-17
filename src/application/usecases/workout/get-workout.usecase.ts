import { IWorkoutRepository } from "@domain/interfaces/IWorkoutRepository";
import { validationError } from "@presentation/middlewares/error.middleware";
import { AuthStatus } from "@shared/constants/index.constants";
import { GetWorkoutQueryDTO } from "@application/dtos/query-dtos";
import { PaginationDTO } from "@application/dtos/utility-dtos";
import { IWorkout } from "@domain/entities/workout.entity";

/**
 * Purpose: Handles the retrieval of workout data for a given user with support for pagination, search, and filtering.
 * Incoming: { userId, query } - User ID and query parameters (pagination, date range, search term, filters).
 * Returns: Object containing workoutList (array of IWorkout) and paginationData (pagination DTO).
 * Throws: validationError if the user ID is missing.
 */

export class GetWorkoutUseCase {
  constructor(private workoutRepository: IWorkoutRepository) {}
  async execute(
    userId: string,
    { page, limit, fromDate, toDate, search, filters }: GetWorkoutQueryDTO
  ): Promise<{ workoutList: IWorkout[]; paginationData: PaginationDTO }> {
    if (!userId) {
      throw new validationError(AuthStatus.IdRequired);
    }
    const query = { page, limit, fromDate, toDate, search, filters };
    const { workoutList, paginationData } =
      await this.workoutRepository.getWorkoutsByUserId(userId, query);

    return { workoutList, paginationData };
  }
}
