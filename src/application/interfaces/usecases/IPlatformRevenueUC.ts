import { IBaseUseCase } from "./IBase.UC";
import { GetRevenueQueryDTO } from "@application/dtos/query-dtos";
import { PaginationDTO } from "@application/dtos/utility-dtos";
import { PlatformRevenue } from "@application/dtos/revenue-dtos";

export interface IGetPlatformEarningsUC
  extends IBaseUseCase<
    GetRevenueQueryDTO,
    {
      revenueData: PlatformRevenue[];
      paginationData: PaginationDTO;
    }
  > {}
