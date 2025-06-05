import { Request, Response } from "express";
import { sendResponse } from "../../../shared/utils/http.response";
import {
  DashboardStatus,
  HttpStatusCodes,
} from "../../../shared/constants/index.constants";
import { UserDashBoardUseCase } from "../../../application/usecases/dashboard/user-dashboard.usecase";
import { parseQueryParams } from "../../../shared/utils/parse.queryParams";

export class UserDashboardController {
  constructor(private userDashBoardUseCase: UserDashBoardUseCase) {}
  async getUserDashBoardData(req: Request, res: Response): Promise<void> {
    const userId = req?.user?._id;
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
      HttpStatusCodes.OK,
      {
        todaysTotalCompletedWorkouts: todaysTotalCompletedWorkouts,
        todaysTotalPendingWorkouts: todaysTotalPendingWorkouts,
        chartData: chartData,
        totalWorkoutTime: totalWorkoutTime,
      },
      DashboardStatus.UserDashBoardRetrievedSuccessfully
    );
  }
}
