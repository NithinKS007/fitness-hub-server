import { NextFunction,Request,Response } from "express";
import { sendResponse } from "../../shared/utils/httpResponse";
import { HttpStatusCodes, HttpStatusMessages } from "../../shared/constants/httpResponseStructure";
import { MonogUserSubscriptionPlanRepository } from "../../infrastructure/databases/repositories/mongoUserSubscriptionRepository";
import { AdminDashBoardUseCase } from "../../application/usecases/adminDashBoardUseCase";
import { MongoTrainerRepository } from "../../infrastructure/databases/repositories/mongoTrainerRepository";
import { MongoUserRepository } from "../../infrastructure/databases/repositories/mongoUserRepository";

//MONGO REPOSITORY INSTANCES
const mongoUserSubscriptionRepository = new MonogUserSubscriptionPlanRepository()
const mongoTrainerRepository = new MongoTrainerRepository()
const mongoUserRepository = new MongoUserRepository()

//USE CASE INSTANCES
const adminDashBoardUseCase = new AdminDashBoardUseCase(mongoUserSubscriptionRepository,mongoUserRepository,mongoTrainerRepository)

export class AdminDashboardController {
static async getAdminDashBoardData(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const {totalUsersCount,totalTrainersCount,pendingTrainerApprovalCount} = await adminDashBoardUseCase.getAdminDashBoardData()
        sendResponse(res, HttpStatusCodes.OK, 
            {totalUsersCount:totalUsersCount,totalTrainersCount:totalTrainersCount,pendingTrainerApprovalCount:pendingTrainerApprovalCount}, 
            HttpStatusMessages.FailedToRetrieveCount);
    } catch (error) {
        console.log(`Error retrieving admin dashboard data: ${error}`);
        next(error);
    }
}
}