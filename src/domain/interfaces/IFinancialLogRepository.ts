import { DateRangeDTO, GetTransactions } from "@application/dtos/query-dtos";
import { Transactions } from "@application/dtos/financialLog-dtos";
import { PagedResponse, PaginationDTO } from "@application/dtos/utility-dtos";
import { IBaseRepository } from "@domain/interfaces/IBaseRepository";
import { financialLog } from "@domain/entities/financialLog.entity";
import { EarningsOverViewUI } from "@application/dtos/read-models";

export interface IFinancialLogRepository
  extends IBaseRepository<financialLog> {
  getTotalServiceFee(): Promise<number>;
  getTotalCommission(): Promise<number>;
  getTotalProfit(): Promise<number>;
  getEarningsOverView(
    earningsOverView: DateRangeDTO
  ): Promise<EarningsOverViewUI[]>;
  getTransactions(dtos: GetTransactions): Promise<PagedResponse<Transactions>>;
}
