import { NextFunction,Request,Response } from "express";
import { sendResponse } from "../../shared/utils/httpResponse";
import { HttpStatusCodes, HttpStatusMessages } from "../../shared/constants/httpResponseStructure";
import { MongoUserSubscriptionPlanRepository } from "../../infrastructure/databases/repositories/userSubscriptionRepository";
import { AdminDashBoardUseCase } from "../../application/usecases/adminDashBoardUseCase";
import { MongoTrainerRepository } from "../../infrastructure/databases/repositories/trainerRepository";
import { MongoUserRepository } from "../../infrastructure/databases/repositories/userRepository";
import { MongoRevenueRepository } from "../../infrastructure/databases/repositories/revenueRepository";

//MONGO REPOSITORY INSTANCES
const mongoUserSubscriptionRepository = new MongoUserSubscriptionPlanRepository()
const mongoTrainerRepository = new MongoTrainerRepository()
const mongoUserRepository = new MongoUserRepository()
const mongoRevenueRepository = new MongoRevenueRepository()

//USE CASE INSTANCES
const adminDashBoardUseCase = new AdminDashBoardUseCase(mongoUserSubscriptionRepository,mongoUserRepository,mongoTrainerRepository,mongoRevenueRepository)

export class AdminDashboardController {
static async getAdminDashBoardData(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {

         const { period } = req.query
         const {
                totalUsersCount,
                totalTrainersCount,
                pendingTrainerApprovalCount,
                totalPlatFormFee,
                totalCommission,
                totalRevenue,
                chartData,
                top5List
               } 
               = await adminDashBoardUseCase.getAdminDashBoardData(period as string)
              sendResponse(res, HttpStatusCodes.OK, 
              { totalUsersCount:totalUsersCount,
                totalTrainersCount:totalTrainersCount,
                pendingTrainerApprovalCount:pendingTrainerApprovalCount, 
                totalPlatFormFee:totalPlatFormFee,
                totalCommission:totalCommission,
                totalRevenue:totalRevenue,
                chartData:chartData,
                topTrainersList:top5List
             }, 
            HttpStatusMessages.AdminDashBoardRetrievedSuccessfully);
    } catch (error) {
        console.log(`Error retrieving admin dashboard data: ${error}`);
        next(error);
    }
}
}