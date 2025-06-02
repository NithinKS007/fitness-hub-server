import { Workout } from "../../../domain/entities/workout.entities";
import { IWorkoutRepository } from "../../../domain/interfaces/IWorkoutRepository";
import { validationError } from "../../../presentation/middlewares/error.middleware";
import { AuthStatus } from "../../../shared/constants/index.constants";
import { GetWorkoutQueryDTO } from "../../dtos/query-dtos";
import { PaginationDTO } from "../../dtos/utility-dtos";

export class GetWorkoutUseCase {
  constructor(private workoutRepository: IWorkoutRepository) {}
  async getWorkoutsByUserId(
    userId: string,
    { page, limit, fromDate, toDate, search, filters }: GetWorkoutQueryDTO
  ): Promise<{ workoutList: Workout[]; paginationData: PaginationDTO }> {
    if (!userId) {
      throw new validationError(AuthStatus.IdRequired);
    }
    const query = { page, limit, fromDate, toDate, search, filters };
    const { workoutList, paginationData } =
      await this.workoutRepository.getWorkoutsByUserId(userId, query);

    return { workoutList, paginationData };
  }
}
