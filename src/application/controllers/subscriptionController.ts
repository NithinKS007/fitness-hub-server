import { NextFunction,Request,Response } from "express-serve-static-core";
import { SubscriptionUseCase } from "../../domain/usecases/subscriptionUseCase";
import { MongoSubscriptionRepository } from "../../infrastructure/databases/repositories/mongoSubscriptionRepository";
import { sendResponse } from "../../shared/utils/httpResponse";
import { HttpStatusCodes, HttpStatusMessages } from "../../shared/constants/httpResponseStructure";

const mongoSubscriptionRepository = new MongoSubscriptionRepository()
const subscription = new SubscriptionUseCase(mongoSubscriptionRepository)
export class SubscriptionController {
    static async addSubscription(req:Request,res:Response,next:NextFunction):Promise<void> {
        try {
            const _id = req.user._id
            const subscriptionData = await subscription.createSubscription({trainerId:_id,...req.body})
             sendResponse(res,HttpStatusCodes.OK,subscriptionData,HttpStatusMessages.SubscriptionCreated);
        } catch (error) {
            console.log(`Error in  adding subscription : ${error}`);
            next(error)
        }
    }

    static async getTrainerSubscriptions(req:Request,res:Response,next:NextFunction):Promise<void> {

        try {
            const _id = req.user._id
            const subscriptionsData = await subscription.getTrainerSubscriptions(_id)
            sendResponse(res,HttpStatusCodes.OK,subscriptionsData,HttpStatusMessages.SubscriptionsListRetrieved);
        } catch (error) {
            console.log(`Error to get trainer subscriptions : ${error}`);
            next(error)
        }
    }
}