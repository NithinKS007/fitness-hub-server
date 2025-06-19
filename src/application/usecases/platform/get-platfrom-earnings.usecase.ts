import { IPlatformEarningsRepository } from "@domain/interfaces/IPlatformEarningsRepository";
import { validationError } from "@presentation/middlewares/error.middleware";
import { RevenueStatus } from "@shared/constants/index.constants";
import { GetRevenueQueryDTO } from "@application/dtos/query-dtos";
import { PlatformRevenue } from "@application/dtos/revenue-dtos";
import { PaginationDTO } from "@application/dtos/utility-dtos";
import { injectable, inject } from "inversify";
import { TYPES_REPOSITORIES } from "di/types-repositories";

@injectable()
export class GetPlatformEarningsUsecase {
  constructor(
    @inject(TYPES_REPOSITORIES.RevenueRepository)
    private platformEarningsRepository: IPlatformEarningsRepository
  ) {}
  
  async execute({
    page,
    limit,
    fromDate,
    toDate,
    search,
    filters,
  }: GetRevenueQueryDTO): Promise<{
    revenueData: PlatformRevenue[];
    paginationData: PaginationDTO;
  }> {
    const query = { page, limit, fromDate, toDate, search, filters };
    const { revenueData, paginationData } =
      await this.platformEarningsRepository.getPlatformEarnings(query);
    if (!revenueData) {
      throw new validationError(RevenueStatus.FetchFailed);
    }
    return { revenueData, paginationData };
  }
}
