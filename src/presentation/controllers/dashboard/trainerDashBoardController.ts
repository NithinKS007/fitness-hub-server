import { Request, Response } from "express";
import { sendResponse } from "../../../shared/utils/httpResponse";
import {
  DashboardStatus,
  HttpStatusCodes,
} from "../../../shared/constants/index-constants";
import { TrainerDashBoardUseCase } from "../../../application/usecases/dashboard/trainerDashBoardUseCase";

export class TrainerDashboardController {
  constructor(private trainerDashBoardUseCase: TrainerDashBoardUseCase) {}
  public async getTrainerDashBoardData(
    req: Request,
    res: Response
  ): Promise<void> {
    const { _id } = req.user;
    const { period } = req.query;
    const {
      totalSubscribersCount,
      activeSubscribersCount,
      canceledSubscribersCount,
      chartData,
      pieChartData,
    } = await this.trainerDashBoardUseCase.getTrainerDashBoardData(
      _id,
      period as string
    );
    sendResponse(
      res,
      HttpStatusCodes.OK,
      {
        totalSubscribersCount: totalSubscribersCount,
        activeSubscribersCount: activeSubscribersCount,
        canceledSubscribersCount: canceledSubscribersCount,
        chartData,
        pieChartData,
      },
      DashboardStatus.TrainerDashBoardRetrievedSuccessfully
    );
  }
}
