import { NextFunction,Request,Response } from "express";
import { sendResponse } from "../../shared/utils/httpResponse";
import { HttpStatusCodes, HttpStatusMessages } from "../../shared/constants/httpResponseStructure";
import { UserDashBoardUseCase } from "../../application/usecases/userDashBoardUseCase";
import { MongoUserSubscriptionPlanRepository } from "../../infrastructure/databases/repositories/userSubscriptionRepository";
import { MongoWorkoutRepository } from "../../infrastructure/databases/repositories/workoutRepository";

//MONGO INSTANCES
const mongoWorkoutRepository = new MongoWorkoutRepository()

//USE CASE INSTANCES
const userDashBoardUseCase = new UserDashBoardUseCase(mongoWorkoutRepository)

export class UserDashboardController {
    static async getUserDashBoardData(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user._id
            const { period,bodyPart } = req.query

            console.log("query data",period,bodyPart)
            const {chartData,todaysTotalCompletedWorkouts,todaysTotalPendingWorkouts,totalWorkoutTime} = await userDashBoardUseCase.getUserDashBoardData({userId:userId,period:period as string,bodyPart:bodyPart as string})

            console.log("user dashboard data for sending")
            sendResponse(res, HttpStatusCodes.OK,
                {
                todaysTotalCompletedWorkouts:todaysTotalCompletedWorkouts,
                todaysTotalPendingWorkouts:todaysTotalPendingWorkouts,
                chartData:chartData,
                totalWorkoutTime:totalWorkoutTime
                },HttpStatusMessages.UserDashBoardRetrievedSuccessfully);
        } catch (error) {
            console.log(`Error to get user dashboard data: ${error}`);
            next(error);
        }
    }

}