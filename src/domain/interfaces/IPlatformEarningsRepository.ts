import {
  DateRangeQueryDTO,
  GetRevenueQueryDTO,
} from "../../application/dtos/query-dtos";
import {
  AdminRevenueHistory,
} from "../../application/dtos/revenue-dtos";
import { PaginationDTO } from "../../application/dtos/utility-dtos";
import { IRevenue } from "../../infrastructure/databases/models/revenue.model";
import { AdminChartData } from "../entities/chart.entities";
import { IBaseRepository } from "./IBaseRepository";

export interface IPlatformEarningsRepository extends IBaseRepository<IRevenue> {
  getTotalPlatFormFee(): Promise<number>;
  getTotalCommission(): Promise<number>;
  getTotalRevenue(): Promise<number>;
  getRevenueChartData(
    revenueChartFilterData: DateRangeQueryDTO
  ): Promise<AdminChartData[]>;
  getPlatformEarnings(revenueQueryFilterData: GetRevenueQueryDTO): Promise<{
    revenueData: AdminRevenueHistory[];
    paginationData: PaginationDTO;
  }>;
}
