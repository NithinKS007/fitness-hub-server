import { NextFunction,Request,Response } from "express-serve-static-core";
import { sendResponse } from "../../shared/utils/httpResponse";
import { HttpStatusCodes, HttpStatusMessages } from "../../shared/constants/httpResponseStructure";
import { SubscriptionUseCase } from "../../application/usecases/subscriptionUseCase";
import { MongoTrainerRepository } from "../../infrastructure/databases/repositories/trainerRepository";
import { MongoUserSubscriptionPlanRepository } from "../../infrastructure/databases/repositories/userSubscriptionRepository";
import { MongoSubscriptionRepository } from "../../infrastructure/databases/repositories/subscriptionRepository";
import { MongoRevenueRepository } from "../../infrastructure/databases/repositories/revenueRepository";

//MONGO REPOSITORY INSTANCES
const mongoSubscriptionRepository = new MongoSubscriptionRepository()
const mongoTrainerRepository = new MongoTrainerRepository()
const monogUserSubscriptionPlanRepository = new MongoUserSubscriptionPlanRepository()
const mongoRevenueRepository = new MongoRevenueRepository()

//USE CASE INSTANCES
const subscriptionUseCase = new SubscriptionUseCase(mongoSubscriptionRepository,mongoTrainerRepository,monogUserSubscriptionPlanRepository,mongoRevenueRepository)

export class SubscriptionController {

static async addSubscription(req:Request,res:Response,next:NextFunction):Promise<void> {
    try {
        const _id = req.user._id
        const subscriptionData = await subscriptionUseCase.createSubscription({trainerId:_id,...req.body})
            sendResponse(res,HttpStatusCodes.OK,subscriptionData,HttpStatusMessages.SubscriptionCreated);
    } catch (error) {
        console.log(`Error adding subscription: ${error}`);
        next(error)
    }
}

static async getTrainerSubscriptions(req:Request,res:Response,next:NextFunction):Promise<void> {

    try {
        const _id = req.user._id
        const subscriptionsData = await subscriptionUseCase.getTrainerSubscriptions(_id)
        sendResponse(res,HttpStatusCodes.OK,subscriptionsData,HttpStatusMessages.SubscriptionsListRetrieved);
    } catch (error) {
        console.log(`Error retrieving trainer subscriptions: ${error}`);
        next(error)
    }
}

static async updateSubscriptionBlockStatus(req:Request,res:Response,next:NextFunction):Promise<void> {

    try {
        const{ _id }= req.params
        const { isBlocked } = req.body
        const updatedSubscriptionStatus = await subscriptionUseCase.updateSubscriptionBlockStatus({_id,isBlocked})
        sendResponse(res,HttpStatusCodes.OK,updatedSubscriptionStatus,HttpStatusMessages.SubscriptionBlockStatusUpdated);
    } catch (error) {
        console.log(`Error updating subscription block status: ${error}`);
        next(error)
    }
}

static async editSubscription(req:Request,res:Response,next:NextFunction):Promise<void> {
    try {
        const { _id } = req.params
        const editSubscriptionData = await subscriptionUseCase.editSubscription({trainerId:req.user._id,_id,...req.body})
        sendResponse(res,HttpStatusCodes.OK,editSubscriptionData,HttpStatusMessages.EditedSuccessfully);
    } catch (error) {
        console.log(`Error editing subscription details: ${error}`)
        next(error)
    }
}

static async deleteSubscription(req:Request,res:Response,next:NextFunction):Promise<void> {

    try {
        const{ _id }= req.params
        const deletedSubscriptionData = await subscriptionUseCase.deleteSubscription(_id)
        sendResponse(res,HttpStatusCodes.OK,deletedSubscriptionData,HttpStatusMessages.DeletedSuccessfully);
    } catch (error) {
        console.log(`Error deleting subscription: ${error}`);
        next(error)
    }
}

static async purchaseSubscription(req:Request,res:Response,next:NextFunction):Promise<void> {
    try {
        const { _id } = req.user
        const { subscriptionId } = req.body
        const sessionId = await subscriptionUseCase.createStripeSession({userId:_id,subscriptionId})
        sendResponse(res,HttpStatusCodes.OK,{sessionId:sessionId},HttpStatusMessages.SubscriptionAddedSuccessfully);
    } catch (error) {
        console.log(`Error purchasing subscription: ${error}`);
        next(error)
    }
}

static async webHookHandler(req:Request,res:Response,next:NextFunction):Promise<void> {
    try {
        const sig = req.headers['stripe-signature'];
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRETKEY
        await subscriptionUseCase.webHookHandler(sig ,webhookSecret,req.body)
        sendResponse(res, HttpStatusCodes.OK, null, HttpStatusMessages.SubscriptionAddedSuccessfully);
    } catch (error) {
        console.log(`Error in webhook handler: ${error}`);
        next(error)
    }
}

static async getSubscriptionDetailsBySessionId(req:Request,res:Response,next:NextFunction):Promise<void> {
    try {
        const {sessionId} = req.params
        const subscriptionData = await subscriptionUseCase.getSubscriptionDetailsBySessionId(sessionId)
        sendResponse(res, HttpStatusCodes.OK, {subscriptionData:subscriptionData}, HttpStatusMessages.SubscriptionAddedSuccessfully);
    } catch (error) {
        console.log(`Error retrieving subscription details by session ID: ${error}`);
        next(error)
    }
}

static async cancelSubscription(req:Request,res:Response,next:NextFunction):Promise<void> {
    try {
        const {  stripeSubscriptionId, action,} = req.body
        const subscriptionCancelledData = await subscriptionUseCase.cancelSubscription({stripeSubscriptionId, action})
        sendResponse(res, HttpStatusCodes.OK,{subscriptionCancelledData:subscriptionCancelledData}, HttpStatusMessages.SubscriptionCancelledSuccessfully);
    } catch (error) {
        console.log(`Error canceling subscription: ${error}`);
        next(error)
    }
}

static async getTrainerSubscribedUsers(req: Request, res: Response,next:NextFunction): Promise<void> {
    try {
        const {_id} = req.user
        console.log("trainers",req.query)
        const { page,limit,search,filters } = req.query
        const {trainerSubscribers,paginationData} = await subscriptionUseCase.getTrainerSubscribedUsers
        (_id,{page:page as string ,search:search as string,limit:limit as string,filters:filters as string[]})
        sendResponse(res,HttpStatusCodes.OK,{trainerSubscribers,paginationData},HttpStatusMessages.SubscriptionsListRetrieved);
    } catch (error: any) {
        console.log(`Error retrieving trainer's subscribed users list: ${error}`);
        next(error)
    }
}

static async getUserSubscriptions(req:Request,res:Response,next:NextFunction):Promise<void>{
    try {
        const { _id } = req.user
        console.log("query received",req.query)
        const { page,limit,search,filters } = req.query
        const {userSubscriptionsList,paginationData} = await subscriptionUseCase.getUserSubscriptionsData(_id,{page:page as string ,search:search as string,limit:limit as string,filters:filters as string[]})
        sendResponse(res,HttpStatusCodes.OK,{userSubscriptionsList,paginationData},HttpStatusMessages.SubscriptionListOfUserRetrievedSuccessfully);
    } catch (error) {
        console.log(`Error retrieving user's subscriptions: ${error}`);
        next(error)
    }      
}

static async isSubscribedToTheTrainer(req:Request,res:Response,next:NextFunction):Promise<void>{
    try {
        const { _id } = req.user
        const trainerId = req.params._id
        const isUserSubscribedToTheTrainer = await subscriptionUseCase.isUserSubscribedToTheTrainer({_id,trainerId})
        sendResponse(res,HttpStatusCodes.OK,{isUserSubscribedToTheTrainer},HttpStatusMessages.UserIsSubscribed);
    } catch (error) {
        console.log(`Error checking user's subscription status: ${error}`);
        next(error)
    }      
}
  
}