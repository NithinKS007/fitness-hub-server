import {
  DateRangeQueryDTO,
  GetRevenueQueryDTO,
} from "../../application/dtos/query-dtos";
import {
  AdminRevenueHistory,
  CreateRevenueDTO,
} from "../../application/dtos/revenue-dtos";
import { PaginationDTO } from "../../application/dtos/utility-dtos";
import { AdminChartData } from "../entities/chart.entities";

export interface IPlatformEarningsRepository {
  create(createRevenueData: CreateRevenueDTO): Promise<void>;
  getTotalPlatFormFee(): Promise<number>;
  getTotalCommission(): Promise<number>;
  getTotalRevenue(): Promise<number>;
  getRevenueChartData(
    revenueChartFilterData: DateRangeQueryDTO
  ): Promise<AdminChartData[]>;
  getPlatformEarnings(
    revenueQueryFilterData: GetRevenueQueryDTO
  ): Promise<{
    revenueData: AdminRevenueHistory[];
    paginationData: PaginationDTO;
  }>;
}
