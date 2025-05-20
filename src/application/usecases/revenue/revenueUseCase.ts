import { IRevenueRepository } from "../../../domain/interfaces/IRevenueRepository";
import { validationError } from "../../../presentation/middlewares/errorMiddleWare";
import { RevenueStatusMessage } from "../../../shared/constants/httpResponseStructure";
import { parseDateRange } from "../../../shared/utils/dayjs";
import { GetRevenueQueryDTO } from "../../dtos/query-dtos";
import { AdminRevenueHistory } from "../../dtos/revenue-dtos";
import { PaginationDTO } from "../../dtos/utility-dtos";
export class RevenueUseCase {
  constructor(private revenueRepository: IRevenueRepository) {}
  public async getAdminRevenueHistory({
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
    const { parsedFromDate, parsedToDate } = parseDateRange(fromDate, toDate);
    const { revenueData, paginationData } =
      await this.revenueRepository.getFullRevenueData({
        page,
        limit,
        fromDate: parsedFromDate,
        toDate: parsedToDate,
        search,
        filters,
      });
    if (!revenueData) {
      throw new validationError(RevenueStatusMessage.FailedToFetchRevenueHistory);
    }
    return { revenueData, paginationData };
  }
}
