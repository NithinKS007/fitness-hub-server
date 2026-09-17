import {
  DateRangeQueryDTO,
  GetRevenueQueryDTO,
} from "@application/dtos/query-dtos";
import { PlatformRevenue } from "@application/dtos/revenue-dtos";
import { PaginationDTO } from "@application/dtos/utility-dtos";
import { IBaseRepository } from "@domain/interfaces/IBaseRepository";
import { AdminChartData } from "@application/dtos/chart-dtos";
import { Revenue } from "@domain/entities/revenue.entity";
import { IRevenue } from "@infrastructure/databases/models/revenue.model";

export interface IPlatformEarningsRepository
  extends IBaseRepository<IRevenue, Revenue> {
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
