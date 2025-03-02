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

    static async updateSubscriptionBlockStatus(req:Request,res:Response,next:NextFunction):Promise<void> {

        try {
            const{ _id }= req.params
            const { isBlocked } = req.body
            const updatedSubscriptionStatus = await subscription.updateSubscriptionBlockStatus({_id,isBlocked})
            sendResponse(res,HttpStatusCodes.OK,updatedSubscriptionStatus,HttpStatusMessages.SubscriptionBlockStatusUpdated);
        } catch (error) {
            console.log(`Error in updating subscription block status : ${error}`);
            next(error)
        }
    }

    static async editSubscription(req:Request,res:Response,next:NextFunction):Promise<void> {
        try {
            const { _id } = req.params
            console.log("id received",_id)
            const editSubscriptionData = await subscription.editSubscription({_id,...req.body})
            sendResponse(res,HttpStatusCodes.OK,editSubscriptionData,HttpStatusMessages.EditedSuccessfully);
        } catch (error) {
            console.log(`Error in editing subscription details : ${error}`);
            next(error)
        }
    }
    static async deleteSubscription(req:Request,res:Response,next:NextFunction):Promise<void> {

        try {
            const{ _id }= req.params
            const deletedSubscriptionData = await subscription.deleteSubscription(_id)
            sendResponse(res,HttpStatusCodes.OK,deletedSubscriptionData,HttpStatusMessages.DeletedSuccessfully);
        } catch (error) {
            console.log(`Error in deleting subscription details : ${error}`);
            next(error)
        }
    }

}