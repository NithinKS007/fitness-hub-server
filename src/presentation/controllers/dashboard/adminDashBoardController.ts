import { Request, Response } from "express";
import { sendResponse } from "../../../shared/utils/httpResponse";
import {
  DashboardStatus,
  HttpStatusCodes,
} from "../../../shared/constants/index-constants";
import { AdminDashBoardUseCase } from "../../../application/usecases/dashboard/adminDashBoardUseCase";

export class AdminDashboardController {
  constructor(private adminDashBoardUseCase: AdminDashBoardUseCase) {}
  public async getAdminDashBoardData(
    req: Request,
    res: Response
  ): Promise<void> {
    const { period } = req.query;
    const {
      totalUsersCount,
      totalTrainersCount,
      pendingTrainerApprovalCount,
      totalPlatFormFee,
      totalCommission,
      totalRevenue,
      chartData,
      top5List,
    } = await this.adminDashBoardUseCase.getAdminDashBoardData(
      period as string
    );
    sendResponse(
      res,
      HttpStatusCodes.OK,
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
      DashboardStatus.AdminDashBoardRetrievedSuccessfully
    );
  }
}
