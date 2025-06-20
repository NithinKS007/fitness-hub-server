import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import { RevenueStatus, StatusCodes } from "@shared/constants/index.constants";
import { GetPlatformEarningsUsecase } from "@application/usecases/platform/get-platfrom-earnings.usecase";
import { parseQueryParams } from "@shared/utils/parse-query-params";
import { TYPES_PLATFORM_USECASES } from "di/types-usecases";

@injectable()
export class GetPlatformEarningsController {
  constructor(
    @inject(TYPES_PLATFORM_USECASES.GetPlatformEarningsUsecase)
    private getPFearningsUseCase: GetPlatformEarningsUsecase
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
