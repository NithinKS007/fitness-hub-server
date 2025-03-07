import { NextFunction,Request,Response } from "express";
import { UpdateProfileUseCase } from "../../domain/usecases/updateProfileUseCase";
import { MonogTrainerRepository } from "../../infrastructure/databases/repositories/mongoTrainerRepository";
import { MongoUserRepository } from "../../infrastructure/databases/repositories/mongouserRepository";
import { sendResponse } from "../../shared/utils/httpResponse";
import { HttpStatusCodes, HttpStatusMessages } from "../../shared/constants/httpResponseStructure";
import { TrainerUseCase } from "../../domain/usecases/trainerUseCase";
import { SubscriptionUseCase } from "../../domain/usecases/subscriptionUseCase";
import { MongoSubscriptionRepository } from "../../infrastructure/databases/repositories/mongoSubscriptionRepository";
import { MonogUserSubscriptionPlanRepository } from "../../infrastructure/databases/repositories/mongoUserSubscriptionRepository";

const mongoUserRepository = new MongoUserRepository()
const mongoTrainerRepository = new MonogTrainerRepository()
const mongoSubscriptionRepository = new MongoSubscriptionRepository()
const mongoUserSubscriptionPlanRepository = new MonogUserSubscriptionPlanRepository()
const profileUseCase = new UpdateProfileUseCase(mongoUserRepository,mongoTrainerRepository)
const trainerUseCase = new TrainerUseCase(mongoTrainerRepository)
const subscriptionSUseCase = new SubscriptionUseCase(mongoSubscriptionRepository,mongoTrainerRepository,mongoUserSubscriptionPlanRepository)

export class UserController {

    static async updateUserProfile(req:Request,res:Response,next:NextFunction):Promise<void>{
        try {
            const {_id} = req.user

            console.log("body data received",req.body)
            const updatedUserData = await profileUseCase.updateTrainerProfile({_id,...req.body});
            sendResponse(
              res,
              HttpStatusCodes.OK,
              updatedUserData,
              HttpStatusMessages.UserDetailsUpdated
            );
        } catch (error:any) {
            console.log(`Error in updating trainer profile: ${error}`);
            next(error)
        }
    }
    static async getApprovedTrainers(req:Request,res:Response,next:NextFunction):Promise<void>{
        try {

            console.log("query received",req.query)
            const searchFilterQuery = req.query
           const trainersData = await trainerUseCase.getApprovedTrainers(searchFilterQuery)
           sendResponse(res,HttpStatusCodes.OK,trainersData,HttpStatusMessages.TrainersList);
        } catch (error) {
           console.log(`Error in retrieving trainers list  : ${error}`);
           next(error)
         }      
      }

    static async getApprovedTrainerDetailsWithSub(req:Request,res:Response,next:NextFunction):Promise<void>{
        try {
            const { _id } = req.params
           const trainersData = await trainerUseCase.getApprovedTrainerDetailsWithSub(_id)
           sendResponse(res,HttpStatusCodes.OK,trainersData,HttpStatusMessages.TrainersList);
        } catch (error) {
           console.log(`Error in retrieving trainers list  : ${error}`);
           next(error)
         }      
    }

    static async getUserSubscriptions(req:Request,res:Response,next:NextFunction):Promise<void>{
        try {
            const { _id } = req.user
           const userSubscriptionsData = await subscriptionSUseCase.getUserSubscriptionsData(_id)
           sendResponse(res,HttpStatusCodes.OK,userSubscriptionsData,HttpStatusMessages.SubscriptionListOfUserRetrievedSuccessfully);
        } catch (error) {
           console.log(`Error in retrieving trainers list  : ${error}`);
           next(error)
         }      
    }

    static async autoSuggestionWithTrainers(req:Request,res:Response,next:NextFunction):Promise<void>{
        try {
        //     const { _id } = req.user
        //    const userSubscriptionsData = await subscriptionSUseCase.getUserSubscriptionsData(_id)
           sendResponse(res,HttpStatusCodes.OK,null,HttpStatusMessages.SubscriptionListOfUserRetrievedSuccessfully);
        } catch (error) {
           console.log(`Error in retrieving trainers list  : ${error}`);
           next(error)
         }      
    }
    
}