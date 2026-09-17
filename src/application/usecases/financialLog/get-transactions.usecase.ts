import { IFinancialLogRepository } from "@domain/interfaces/IFinancialLogRepository";
import { validationError } from "@presentation/middlewares/error.middleware";
import { TransactionStatus } from "@shared/constants/index.constants";
import { GetTransactions } from "@application/dtos/query-dtos";
import { Transactions } from "@application/dtos/financialLog-dtos";
import { PaginationDTO } from "@application/dtos/utility-dtos";
import { injectable, inject } from "inversify";
import { TYPES_REPOSITORIES } from "@di/types-repositories";
import { IGetTransactionsUC } from "@application/interfaces/usecases/ITransactionsUC";

@injectable()
export class GetTransactionsUsecase implements IGetTransactionsUC {
  constructor(
    @inject(TYPES_REPOSITORIES.FinancialLogRepository)
    private financialLogRepository: IFinancialLogRepository
  ) {}

  async execute({
    page,
    limit,
    fromDate,
    toDate,
    search,
    filters,
  }: GetTransactions): Promise<{
    transactions: Transactions[];
    paginationData: PaginationDTO;
  }> {
    const query = { page, limit, fromDate, toDate, search, filters };
    const { data: transactions, pagination: paginationData } =
      await this.financialLogRepository.getTransactions(query);
    if (!transactions) {
      throw new validationError(TransactionStatus.FetchFailed);
    }
    return { transactions, paginationData };
  }
}
