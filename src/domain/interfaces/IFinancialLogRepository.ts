import { DateRangeDTO, GetTransactions } from "@application/dtos/query-dtos";
import { Transactions } from "@application/dtos/financialLog-dtos";
import { PagedResponse, PaginationDTO } from "@application/dtos/utility-dtos";
import { IBaseRepository } from "@domain/interfaces/IBaseRepository";
import { financialLog } from "@domain/entities/financialLog.entity";
import { IFinancialLog } from "@infrastructure/databases/models/financialLog.model";
import { EarningsOverViewUI } from "@infrastructure/mappers/chart.mappers";

export interface IFinancialLogRepository
  extends IBaseRepository<IFinancialLog, financialLog> {
  getTotalServiceFee(): Promise<number>;
  getTotalCommission(): Promise<number>;
  getTotalProfit(): Promise<number>;
  getEarningsOverView(
    earningsOverView: DateRangeDTO
  ): Promise<EarningsOverViewUI[]>;
  getTransactions(dtos: GetTransactions): Promise<PagedResponse<Transactions>>;
}
