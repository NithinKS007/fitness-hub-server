import { Transactions } from "@application/dtos/financialLog-dtos";
import { IBaseUseCase } from "./IBase.UC";
import { GetTransactions } from "@application/dtos/query-dtos";
import { PaginationDTO } from "@application/dtos/utility-dtos";

export interface IGetTransactionsUC
  extends IBaseUseCase<
    GetTransactions,
    {
      transactions: Transactions[];
      paginationData: PaginationDTO;
    }
  > {}
