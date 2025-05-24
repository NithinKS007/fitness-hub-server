import { Request, Response } from "express";
import { sendResponse } from "../../../shared/utils/httpResponse";
import {
  DashboardStatus,
  HttpStatusCodes,
} from "../../../shared/constants/index-constants";
import { MongoUserSubscriptionPlanRepository } from "../../../infrastructure/databases/repositories/userSubscriptionRepository";
import { TrainerDashBoardUseCase } from "../../../application/usecases/dashboard/trainerDashBoardUseCase";

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
      DashboardStatus.TrainerDashBoardRetrievedSuccessfully
    );
  }
}
