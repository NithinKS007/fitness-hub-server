import { RevenueRepository } from "../../domain/interfaces/revenueRepository";
import { validationError } from "../../interfaces/middlewares/errorMiddleWare";
import { HttpStatusMessages } from "../../shared/constants/httpResponseStructure";
import { GetRevenueQueryDTO } from "../dtos/queryDTOs";
import { AdminRevenueHistory } from "../dtos/revenueDTOs";
import { PaginationDTO } from "../dtos/utilityDTOs";
export class RevenueHistory {
    constructor(private revenueRepository: RevenueRepository) {}
    public async getAdminRevenueHistory(data:GetRevenueQueryDTO): Promise<{revenueData:AdminRevenueHistory[],paginationData:PaginationDTO}> {
        const {revenueData,paginationData} = await this.revenueRepository.getFullRevenueData(data);
        if(!revenueData){
            throw new validationError(HttpStatusMessages.FailedToFetchRevenueHistory)
        }
        return {revenueData,paginationData}
    }
  }
  