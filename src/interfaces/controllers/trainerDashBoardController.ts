import { NextFunction,Request,Response } from "express";
import { sendResponse } from "../../shared/utils/httpResponse";
import { HttpStatusCodes, HttpStatusMessages } from "../../shared/constants/httpResponseStructure";
import { MonogUserSubscriptionPlanRepository } from "../../infrastructure/databases/repositories/mongoUserSubscriptionRepository";
import { TrainerDashBoardUseCase } from "../../application/usecases/trainerDashBoardUseCase";

//MONGO REPOSITORY INSTANCES
const mongoUserSubscriptionRepository = new MonogUserSubscriptionPlanRepository()

//USE CASE INSTANCES
const trainerDashBoardUseCase = new TrainerDashBoardUseCase(mongoUserSubscriptionRepository)

export class TrainerDashboardController {
    static async getTrainerDashBoardData(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { _id } = req.user
            const { period } = req.query
            const { totalSubscribersCount,activeSubscribersCount,canceledSubscribersCount,chartData,pieChartData } = await trainerDashBoardUseCase.getTrainerDashBoardData(_id,period as string)
            sendResponse(res, HttpStatusCodes.OK, 
                {totalSubscribersCount:totalSubscribersCount,activeSubscribersCount:activeSubscribersCount,canceledSubscribersCount:canceledSubscribersCount,chartData,pieChartData}, 
                HttpStatusMessages.FailedToRetrieveCount);
        } catch (error) {
            console.log(`Error retrieving total subscribers count for trainer: ${error}`);
            next(error);
        }
    }

}