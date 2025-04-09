import { DateRangeQueryDTO, GetRevenueQueryDTO } from "../../application/dtos/queryDTOs";
import { AdminRevenueHistory, CreateRevenueDTO } from "../../application/dtos/revenueDTOs";
import { PaginationDTO } from "../../application/dtos/utilityDTOs";
import { AdminChartData } from "../entities/chartEntity";
export interface RevenueRepository {
    create(data:CreateRevenueDTO):Promise<void>
    getTotalPlatFormFee():Promise<number>
    getTotalCommission():Promise<number>
    getTotalRevenue():Promise<number>
    getRevenueChartData(data:DateRangeQueryDTO):Promise<AdminChartData[]>
    getFullRevenueData(data:GetRevenueQueryDTO):Promise<{revenueData:AdminRevenueHistory[],paginationData:PaginationDTO}>
}