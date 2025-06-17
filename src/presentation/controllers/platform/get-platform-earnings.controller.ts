import { Request, Response } from "express";
import { sendResponse } from "@shared/utils/http.response";
import { RevenueStatus, StatusCodes } from "@shared/constants/index.constants";
import { GetPlatformEarningsUsecase } from "@application/usecases/platform/get-platfrom-earnings.usecase";
import { parseQueryParams } from "@shared/utils/parse.queryParams";

export class GetPlatformEarningsController {
  constructor(private getPFearningsUseCase: GetPlatformEarningsUsecase) {}

  async handleGetEarnings(req: Request, res: Response): Promise<void> {
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
