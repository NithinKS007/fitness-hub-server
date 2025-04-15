import { DateRangeQueryDTO, GetRevenueQueryDTO } from "../../application/dtos/queryDTOs";
import { AdminRevenueHistory, CreateRevenueDTO } from "../../application/dtos/revenueDTOs";
import { PaginationDTO } from "../../application/dtos/utilityDTOs";
import { AdminChartData } from "../entities/chartEntity";

export interface IRevenueRepository {
    create(createRevenueData:CreateRevenueDTO):Promise<void>
    getTotalPlatFormFee():Promise<number>
    getTotalCommission():Promise<number>
    getTotalRevenue():Promise<number>
    getRevenueChartData(revenueChartFilterData:DateRangeQueryDTO):Promise<AdminChartData[]>
    getFullRevenueData(revenueQueryFilterData:GetRevenueQueryDTO):Promise<{revenueData:AdminRevenueHistory[],paginationData:PaginationDTO}>
}