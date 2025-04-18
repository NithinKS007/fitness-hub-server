import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../shared/utils/httpResponse";
import {
  HttpStatusCodes,
  HttpStatusMessages,
} from "../../shared/constants/httpResponseStructure";
import { UserDashBoardUseCase } from "../../application/usecases/userDashBoardUseCase";
import { MongoWorkoutRepository } from "../../infrastructure/databases/repositories/workoutRepository";
import { handleLogError } from "../../shared/utils/handleLog";

//MONGO INSTANCES
const mongoWorkoutRepository = new MongoWorkoutRepository();

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
        HttpStatusMessages.UserDashBoardRetrievedSuccessfully
      );
    } catch (error) {
      handleLogError(
        error,
        "UserDashboardController.getUserDashBoardData",
        "Error to get user dashboard data"
      );
      next(error);
    }
  }
}
