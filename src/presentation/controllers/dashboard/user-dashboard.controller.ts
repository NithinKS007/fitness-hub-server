import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import {
  DashboardStatus,
  StatusCodes,
} from "@shared/constants/index.constants";
import { UserDashBoardUseCase } from "@application/usecases/dashboard/user-dashboard.usecase";
import { parseQueryParams } from "@shared/utils/parse-query-params";
import { TYPES_DASHBOARD_USECASES } from "@di/types-usecases";

@injectable()
export class UserDashboardController {
  constructor(
    @inject(TYPES_DASHBOARD_USECASES.UserDashBoardUseCase)
    private userDashBoardUseCase: UserDashBoardUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const { _id: userId } = req?.user || {};

    const {
      chartData,
      todaysTotalCompletedWorkouts,
      todaysTotalPendingWorkouts,
      totalWorkoutTime,
    } = await this.userDashBoardUseCase.execute({
      userId,
      ...parseQueryParams(req.query),
    });

    sendResponse(
      res,
      StatusCodes.OK,
      {
        todaysTotalCompletedWorkouts: todaysTotalCompletedWorkouts,
        todaysTotalPendingWorkouts: todaysTotalPendingWorkouts,
        chartData: chartData,
        totalWorkoutTime: totalWorkoutTime,
      },
      DashboardStatus.UserDashRetrieved
    );
  }
}
