import { Request, Response } from "express";
import { sendResponse } from "../../../shared/utils/httpResponse";
import {
  DashboardStatus,
  HttpStatusCodes,
} from "../../../shared/constants/index-constants";
import { MongoUserSubscriptionPlanRepository } from "../../../infrastructure/databases/repositories/userSubscriptionRepository";
import { AdminDashBoardUseCase } from "../../../application/usecases/dashboard/adminDashBoardUseCase";
import { MongoTrainerRepository } from "../../../infrastructure/databases/repositories/trainerRepository";
import { MongoUserRepository } from "../../../infrastructure/databases/repositories/userRepository";
import { MongoRevenueRepository } from "../../../infrastructure/databases/repositories/revenueRepository";
import { LoggerHelper } from "../../../shared/utils/handleLog";
import { LoggerService } from "../../../infrastructure/logging/logger";

//MONGO REPOSITORY INSTANCES
const mongoUserSubscriptionRepository =
  new MongoUserSubscriptionPlanRepository();
const mongoTrainerRepository = new MongoTrainerRepository();
const mongoUserRepository = new MongoUserRepository();
const mongoRevenueRepository = new MongoRevenueRepository();

//SERVICE INSTANCES
const logger = new LoggerService();
const loggerHelper = new LoggerHelper(logger);

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
    res: Response
  ): Promise<void> {
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
      DashboardStatus.AdminDashBoardRetrievedSuccessfully
    );
  }
}
