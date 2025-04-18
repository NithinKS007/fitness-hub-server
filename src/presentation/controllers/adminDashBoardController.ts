import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../shared/utils/httpResponse";
import {
  DashboardStatusMessage,
  HttpStatusCodes,
} from "../../shared/constants/httpResponseStructure";
import { MongoUserSubscriptionPlanRepository } from "../../infrastructure/databases/repositories/userSubscriptionRepository";
import { AdminDashBoardUseCase } from "../../application/usecases/adminDashBoardUseCase";
import { MongoTrainerRepository } from "../../infrastructure/databases/repositories/trainerRepository";
import { MongoUserRepository } from "../../infrastructure/databases/repositories/userRepository";
import { MongoRevenueRepository } from "../../infrastructure/databases/repositories/revenueRepository";
import { handleLogError } from "../../shared/utils/handleLog";

//MONGO REPOSITORY INSTANCES
const mongoUserSubscriptionRepository =
  new MongoUserSubscriptionPlanRepository();
const mongoTrainerRepository = new MongoTrainerRepository();
const mongoUserRepository = new MongoUserRepository();
const mongoRevenueRepository = new MongoRevenueRepository();

//USE CASE INSTANCES
const adminDashBoardUseCase = new AdminDashBoardUseCase(
  mongoUserSubscriptionRepository,
  mongoUserRepository,
  mongoTrainerRepository,
  mongoRevenueRepository
);

export class AdminDashboardController {
  static async getAdminDashBoardData(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { period } = req.query;
      const {
        totalUsersCount,
        totalTrainersCount,
        pendingTrainerApprovalCount,
        totalPlatFormFee,
        totalCommission,
        totalRevenue,
        chartData,
        top5List,
      } = await adminDashBoardUseCase.getAdminDashBoardData(period as string);
      sendResponse(
        res,
        HttpStatusCodes.OK,
        {
          totalUsersCount: totalUsersCount,
          totalTrainersCount: totalTrainersCount,
          pendingTrainerApprovalCount: pendingTrainerApprovalCount,
          totalPlatFormFee: totalPlatFormFee,
          totalCommission: totalCommission,
          totalRevenue: totalRevenue,
          chartData: chartData,
          topTrainersList: top5List,
        },
        DashboardStatusMessage.AdminDashBoardRetrievedSuccessfully
      );
    } catch (error) {
      handleLogError(
        error,
        "AdminDashboardController.getAdminDashBoardData",
        "Error retrieving admin dashboard data"
      );
      next(error);
    }
  }
}
