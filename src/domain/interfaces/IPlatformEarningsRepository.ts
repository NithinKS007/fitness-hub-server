import {
  DateRangeQueryDTO,
  GetRevenueQueryDTO,
} from "@application/dtos/query-dtos";
import { PlatformRevenue } from "@application/dtos/revenue-dtos";
import { PaginationDTO } from "@application/dtos/utility-dtos";
import { IBaseRepository } from "@domain/interfaces/IBaseRepository";
import { AdminChartData } from "@application/dtos/chart-dtos";
import { IRevenue } from "@domain/entities/revenue.entity";

export interface IPlatformEarningsRepository extends IBaseRepository<IRevenue> {
  getTotalPlatFormFee(): Promise<number>;
  getTotalCommission(): Promise<number>;
  getTotalRevenue(): Promise<number>;
  getRevenueChartData(
    revenueChartFilterData: DateRangeQueryDTO
  ): Promise<AdminChartData[]>;
  getPlatformEarnings(revenueQueryFilterData: GetRevenueQueryDTO): Promise<{
    revenueData: PlatformRevenue[];
    paginationData: PaginationDTO;
  }>;
}
