import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import {
  DashboardStatus,
  StatusCodes,
} from "@shared/constants/index.constants";
import { AdminDashBoardUseCase } from "@application/usecases/dashboard/admin-dashboard.usecase";
import { parseQueryParams } from "@shared/utils/parse-query-params";
import { TYPES_DASHBOARD_USECASES } from "di/types-usecases";

@injectable()
export class AdminDashboardController {
  constructor(
    @inject(TYPES_DASHBOARD_USECASES.AdminDashBoardUseCase)
    private adminDashBoardUseCase: AdminDashBoardUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const period = parseQueryParams(req.query).period;

    const {
      totalUsersCount,
      totalTrainersCount,
      pendingTrainerApprovalCount,
      totalPlatFormFee,
      totalCommission,
      totalRevenue,
      chartData,
      top5List,
    } = await this.adminDashBoardUseCase.execute(period);

    sendResponse(
      res,
      StatusCodes.OK,
      {
        totalUsersCount: totalUsersCount,
        totalTrainersCount: totalTrainersCount,
        pendingTrainerApprovalCount: pendingTrainerApprovalCount,
        totalPlatFormFee: totalPlatFormFee,
        totalCommission: totalCommission,
        totalRevenue: totalRevenue,
        chartData: chartData,
        topTrainersList: top5List,
      },
      DashboardStatus.AdminDashRetrieved
    );
  }
}
