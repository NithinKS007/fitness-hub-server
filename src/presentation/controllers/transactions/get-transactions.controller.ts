import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import { TransactionStatus, StatusCodes } from "@shared/constants/index.constants";
import { parseQueryParams } from "@shared/utils/parse-query-params";
import { TYPES_COMMISSION_HISTORY_USECASES } from "@di/types-usecases";
import { IGetTransactionsUC } from "@application/interfaces/usecases/ITransactionsUC";

@injectable()
export class GetTransactionsController {
  constructor(
    @inject(TYPES_COMMISSION_HISTORY_USECASES.GetTransactionsUsecase)
    private usecase: IGetTransactionsUC
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const { transactions, paginationData } = await this.usecase.execute(
      parseQueryParams(req.query)
    );

    sendResponse(
      res,
      StatusCodes.OK,
      {
        transactions: transactions,
        paginationData: paginationData,
      },
      TransactionStatus.Fetched
    );
  }
}
