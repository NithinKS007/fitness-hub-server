import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../shared/utils/httpResponse";
import {
  DashboardStatusMessage,
  HttpStatusCodes,
} from "../../shared/constants/httpResponseStructure";
import { MongoUserSubscriptionPlanRepository } from "../../infrastructure/databases/repositories/userSubscriptionRepository";
import { TrainerDashBoardUseCase } from "../../application/usecases/trainerDashBoardUseCase";
import { handleLogError } from "../../shared/utils/handleLog";

//MONGO REPOSITORY INSTANCES
const mongoUserSubscriptionRepository =
  new MongoUserSubscriptionPlanRepository();

//USE CASE INSTANCES
const trainerDashBoardUseCase = new TrainerDashBoardUseCase(
  mongoUserSubscriptionRepository
);

export class TrainerDashboardController {
  static async getTrainerDashBoardData(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { _id } = req.user;
      const { period } = req.query;
      const {
        totalSubscribersCount,
        activeSubscribersCount,
        canceledSubscribersCount,
        chartData,
        pieChartData,
      } = await trainerDashBoardUseCase.getTrainerDashBoardData(
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
        DashboardStatusMessage.TrainerDashBoardRetrievedSuccessfully
      );
    } catch (error) {
      handleLogError(
        error,
        "TrainerDashboardController.getTrainerDashBoardData",
        "Error retrieving trainer dashboard data"
      );
      next(error);
    }
  }
}
