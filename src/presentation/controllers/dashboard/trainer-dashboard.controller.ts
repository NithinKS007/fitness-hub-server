import { Request, Response } from "express";
import { sendResponse } from "@shared/utils/http.response";
import {
  DashboardStatus,
  StatusCodes,
} from "@shared/constants/index.constants";
import { TrainerDashBoardUseCase } from "@application/usecases/dashboard/trainer-dashboard.usecase";
import { parseQueryParams } from "@shared/utils/parse.queryParams";

export class TrainerDashboardController {
  constructor(private trainerDashBoardUseCase: TrainerDashBoardUseCase) {}

  async getTrainerDashBoardData(req: Request, res: Response): Promise<void> {

    const { _id: trainerId } = req?.user || {}; 

    const period = parseQueryParams(req.query).period;

    const {
      totalSubscribersCount,
      activeSubscribersCount,
      canceledSubscribersCount,
      chartData,
      pieChartData,
    } = await this.trainerDashBoardUseCase.execute(trainerId, period);

    sendResponse(
      res,
      StatusCodes.OK,
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
