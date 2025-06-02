import { IPlatformEarningsRepository } from "../../../domain/interfaces/IPlatformEarningsRepository";
import { validationError } from "../../../presentation/middlewares/error.middleware";
import { RevenueStatus } from "../../../shared/constants/index.constants";
import { GetRevenueQueryDTO } from "../../dtos/query-dtos";
import { AdminRevenueHistory } from "../../dtos/revenue-dtos";
import { PaginationDTO } from "../../dtos/utility-dtos";
export class GetPlatformEarningsUsecase {
  constructor(
    private platformEarningsRepository: IPlatformEarningsRepository
  ) {}
  async getPlatformEarnings({
    page,
    limit,
    fromDate,
    toDate,
    search,
    filters,
  }: GetRevenueQueryDTO): Promise<{
    revenueData: AdminRevenueHistory[];
    paginationData: PaginationDTO;
  }> {
    const query = { page, limit, fromDate, toDate, search, filters };
    const { revenueData, paginationData } =
      await this.platformEarningsRepository.getPlatformEarnings(query);
    if (!revenueData) {
      throw new validationError(RevenueStatus.FailedToFetchRevenueHistory);
    }
    return { revenueData, paginationData };
  }
}
