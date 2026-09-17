import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import {
  DashboardStatus,
  StatusCodes,
} from "@shared/constants/index.constants";
import { parseQueryParams } from "@shared/utils/parse-query-params";
import { TYPES_DASHBOARD_USECASES } from "@di/types-usecases";
import { IAdminDashBoardUC } from "@application/interfaces/usecases/IDashBoardUC";

@injectable()
export class AdminDashboardController {
  constructor(
    @inject(TYPES_DASHBOARD_USECASES.AdminDashBoardUseCase)
    private adminDashBoardUseCase: IAdminDashBoardUC
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const period = parseQueryParams(req.query).period;

    const {
      totalUsersCount,
      totalTrainersCount,
      pendingTrainerApprovalCount,
      totalServiceFee,
      totalCommission,
      totalRevenue,
      earningOverView,
      Top5Trainers,
    } = await this.adminDashBoardUseCase.execute(period);

    sendResponse(
      res,
      StatusCodes.OK,
      {
        totalUsersCount: totalUsersCount,
        totalTrainersCount: totalTrainersCount,
        pendingTrainerApprovalCount: pendingTrainerApprovalCount,
        totalServiceFee: totalServiceFee,
        totalCommission: totalCommission,
        totalRevenue: totalRevenue,
        earningOverView: earningOverView,
        Top5Trainers: Top5Trainers,
      },
      DashboardStatus.AdminDashRetrieved
    );
  }
}
