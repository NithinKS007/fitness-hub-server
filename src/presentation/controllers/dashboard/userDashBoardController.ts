import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../../shared/utils/httpResponse";
import {
  DashboardStatusMessage,
  HttpStatusCodes,
} from "../../../shared/constants/httpResponseStructure";
import { UserDashBoardUseCase } from "../../../application/usecases/dashboard/userDashBoardUseCase";
import { MongoWorkoutRepository } from "../../../infrastructure/databases/repositories/workoutRepository";
import { LoggerService } from "../../../infrastructure/logging/logger";
import { LoggerHelper } from "../../../shared/utils/handleLog";

//MONGO INSTANCES
const mongoWorkoutRepository = new MongoWorkoutRepository();

//SERVICE INSTANCES
const logger = new LoggerService();
const loggerHelper = new LoggerHelper(logger);

//USE CASE INSTANCES
const userDashBoardUseCase = new UserDashBoardUseCase(mongoWorkoutRepository);

export class UserDashboardController {
  static async getUserDashBoardData(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user._id;
      const { period, bodyPart } = req.query;
      const {
        chartData,
        todaysTotalCompletedWorkouts,
        todaysTotalPendingWorkouts,
        totalWorkoutTime,
      } = await userDashBoardUseCase.getUserDashBoardData({
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
        DashboardStatusMessage.UserDashBoardRetrievedSuccessfully
      );
    } catch (error) {
      loggerHelper.handleLogError(
        error,
        "UserDashboardController.getUserDashBoardData",
        "Error to get user dashboard data"
      );
      next(error);
    }
  }
}
