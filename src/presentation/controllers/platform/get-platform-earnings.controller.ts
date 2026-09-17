import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import { RevenueStatus, StatusCodes } from "@shared/constants/index.constants";
import { parseQueryParams } from "@shared/utils/parse-query-params";
import { TYPES_PLATFORM_USECASES } from "@di/types-usecases";
import { IGetPlatformEarningsUC } from "@application/interfaces/usecases/IPlatformRevenueUC";

@injectable()
export class GetPlatformEarningsController {
  constructor(
    @inject(TYPES_PLATFORM_USECASES.GetPlatformEarningsUsecase)
    private getPFearningsUseCase: IGetPlatformEarningsUC
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const { revenueData, paginationData } =
      await this.getPFearningsUseCase.execute(parseQueryParams(req.query));

    sendResponse(
      res,
      StatusCodes.OK,
      { revenueData: revenueData, paginationData: paginationData },
      RevenueStatus.Fetched
    );
  }
}
