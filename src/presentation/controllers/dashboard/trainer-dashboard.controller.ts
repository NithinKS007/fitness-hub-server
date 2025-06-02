import { Request, Response } from "express";
import { sendResponse } from "../../../shared/utils/http.response";
import {
  DashboardStatus,
  HttpStatusCodes,
} from "../../../shared/constants/index.constants";
import { TrainerDashBoardUseCase } from "../../../application/usecases/dashboard/trainer-dashboard.usecase";
import { parseQueryParams } from "../../../shared/utils/parse.queryParams";

export class TrainerDashboardController {
  constructor(private trainerDashBoardUseCase: TrainerDashBoardUseCase) {}
  async getTrainerDashBoardData(req: Request, res: Response): Promise<void> {
    const trainerId = req?.user?._id;
    const period = parseQueryParams(req.query).period;
    const {
      totalSubscribersCount,
      activeSubscribersCount,
      canceledSubscribersCount,
      chartData,
      pieChartData,
    } = await this.trainerDashBoardUseCase.getTrainerDashBoardData(
      trainerId,
      period
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
