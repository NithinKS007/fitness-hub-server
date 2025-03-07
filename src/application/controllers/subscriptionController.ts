import { NextFunction,Request,Response } from "express-serve-static-core";
import { SubscriptionUseCase } from "../../domain/usecases/subscriptionUseCase";
import { MongoSubscriptionRepository } from "../../infrastructure/databases/repositories/mongoSubscriptionRepository";
import { sendResponse } from "../../shared/utils/httpResponse";
import { HttpStatusCodes, HttpStatusMessages } from "../../shared/constants/httpResponseStructure";
import { MonogTrainerRepository } from "../../infrastructure/databases/repositories/mongoTrainerRepository";
import { MonogUserSubscriptionPlanRepository } from "../../infrastructure/databases/repositories/mongoUserSubscriptionRepository";
import dotenv from 'dotenv';
dotenv.config();

const mongoSubscriptionRepository = new MongoSubscriptionRepository()
const mongoTrainerRepository = new MonogTrainerRepository()
const monogUserSubscriptionPlanRepository = new MonogUserSubscriptionPlanRepository()
const subscription = new SubscriptionUseCase(mongoSubscriptionRepository,mongoTrainerRepository,monogUserSubscriptionPlanRepository)
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
            const editSubscriptionData = await subscription.editSubscription({trainerId:req.user._id,_id,...req.body})
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

    static async purchaseSubscription(req:Request,res:Response,next:NextFunction):Promise<void> {
        try {
            const { _id }= req.user
            const { subscriptionId } =req.body
            const sessionId = await subscription.createStripeSession({userId:_id,subscriptionId})
            sendResponse(res,HttpStatusCodes.OK,{sessionId:sessionId},HttpStatusMessages.SubscriptionAddedSuccessfully);
        } catch (error) {
            console.log(`Error in purchasing subscription: ${error}`);
            next(error)
        }
    }

    static async webHookHandler(req:Request,res:Response,next:NextFunction):Promise<void> {
        try {
            const sig = req.headers['stripe-signature'];
            const webhookSecret = process.env.STRIPE_WEBHOOK_SECRETKEY
            await subscription.webHookHandler(sig ,webhookSecret,req.body)
            sendResponse(res, HttpStatusCodes.OK, null, HttpStatusMessages.SubscriptionAddedSuccessfully);
        } catch (error) {
            console.log(`Error in web hook handler: ${error}`);
            next(error)
        }
    }
    static async getSubscriptionDetailsBySessionId(req:Request,res:Response,next:NextFunction):Promise<void> {
        try {

            const {sessionId} = req.params
            const subscriptionData = await subscription.getSubscriptionDetailsBySessionId(sessionId)
            sendResponse(res, HttpStatusCodes.OK, {subscriptionData:subscriptionData}, HttpStatusMessages.SubscriptionAddedSuccessfully);
        } catch (error) {
            console.log(`Error in web hook handler: ${error}`);
            next(error)
        }
    }



    static async  cancelSubscription(req:Request,res:Response,next:NextFunction):Promise<void> {
        try {
            const {  stripeSubscriptionId, action, userSubCollectionId,} = req.body
            console.log("data received in req.body",  stripeSubscriptionId,
                action,
                userSubCollectionId)
            const subscriptionCancelledData = await subscription.cancelSubscription({stripeSubscriptionId, action, userSubCollectionId})
            sendResponse(res, HttpStatusCodes.OK,{subscriptionCancelledData:subscriptionCancelledData}, HttpStatusMessages.SubscriptionCancelledSuccessfully);
        } catch (error) {
            console.log(`Error in cancelling subscriptions : ${error}`);
            next(error)
        }
    }



}