import { Workout } from "../../../domain/entities/workout";
import { IWorkoutRepository } from "../../../domain/interfaces/IWorkoutRepository";
import { validationError } from "../../../presentation/middlewares/errorMiddleWare";
import { AuthStatus } from "../../../shared/constants/index-constants";
import { GetWorkoutQueryDTO } from "../../dtos/query-dtos";
import { IdDTO, PaginationDTO } from "../../dtos/utility-dtos";
import { parseDateRange } from "../../../shared/utils/dayjs";

export class GetWorkoutUseCase {
  constructor(private workoutRepository: IWorkoutRepository) {}
  public async getWorkoutsByUserId(
    userId: IdDTO,
    { page, limit, fromDate, toDate, search, filters }: GetWorkoutQueryDTO
  ): Promise<{ workoutList: Workout[]; paginationData: PaginationDTO }> {
    if (!userId) {
      throw new validationError(AuthStatus.IdRequired);
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
}
