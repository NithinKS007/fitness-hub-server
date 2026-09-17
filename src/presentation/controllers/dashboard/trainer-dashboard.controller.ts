import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import {
  DashboardStatus,
  StatusCodes,
} from "@shared/constants/index.constants";
import { parseQueryParams } from "@shared/utils/parse-query-params";
import { TYPES_DASHBOARD_USECASES } from "@di/types-usecases";
import { ITrainerDashBoardUC } from "@application/interfaces/usecases/IDashBoardUC";

@injectable()
export class TrainerDashboardController {
  constructor(
    @inject(TYPES_DASHBOARD_USECASES.TrainerDashBoardUseCase)
    private trainerDashBoardUseCase: ITrainerDashBoardUC
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const { _id: trainerId } = req?.user || {};

    const period = parseQueryParams(req.query).period;

    const {
      totalSubscribersCount,
      activeSubscribersCount,
      canceledSubscribersCount,
      chartData,
      pieChartData,
    } = await this.trainerDashBoardUseCase.execute({ trainerId, period });

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
      DashboardStatus.TrainerDashRetrieved
    );
  }
}
