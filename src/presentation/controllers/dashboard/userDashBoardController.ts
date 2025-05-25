import { Request, Response } from "express";
import { sendResponse } from "../../../shared/utils/httpResponse";
import {
  DashboardStatus,
  HttpStatusCodes,
} from "../../../shared/constants/index-constants";
import { UserDashBoardUseCase } from "../../../application/usecases/dashboard/userDashBoardUseCase";

export class UserDashboardController {
  constructor(private userDashBoardUseCase: UserDashBoardUseCase) {}
  public async getUserDashBoardData(
    req: Request,
    res: Response
  ): Promise<void> {
    const userId = req.user._id;
    const { period, bodyPart } = req.query;
    const {
      chartData,
      todaysTotalCompletedWorkouts,
      todaysTotalPendingWorkouts,
      totalWorkoutTime,
    } = await this.userDashBoardUseCase.getUserDashBoardData({
      userId: userId,
      period: period as string,
      bodyPart: bodyPart as string,
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
