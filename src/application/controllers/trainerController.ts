import { NextFunction,Request,Response } from "express";
import { UserUseCase } from "../../domain/usecases/userUseCase";
import { MongoUserRepository } from "../../infrastructure/databases/repositories/mongouserRepository";
import { HttpStatusCodes, HttpStatusMessages } from "../../shared/constants/httpResponseStructure";
import { sendResponse } from "../../shared/utils/httpResponse";
import { MongoSubscriptionRepository } from "../../infrastructure/databases/repositories/mongoSubscriptionRepository";

const mongoUserRepository = new MongoUserRepository()
const mongoSubscriptionRepository = new MongoSubscriptionRepository()
const user = new UserUseCase(mongoUserRepository,mongoSubscriptionRepository)

export class TrainerController {
    static async getTrainers(req:Request,res:Response,next:NextFunction):Promise<void>{
    try {
       const trainersData = await user.getApprovedTrainers()
       sendResponse(res,HttpStatusCodes.OK,trainersData,HttpStatusMessages.TrainersList);
    } catch (error) {
       console.log(`Error in retrieving trainers list  : ${error}`);
       next(error)
     }      
   }

   static async getTrainerWithSubscription(req:Request,res:Response,next:NextFunction):Promise<void> {
      try {
         const {_id} = req.params
         const trainersData = await user.getTrainerWithSubscription(_id)
         sendResponse(res,HttpStatusCodes.OK,trainersData,HttpStatusMessages.TrainersList);
      } catch (error) {
         console.log(`Error in retrieving trainers list  : ${error}`);
         next(error)
       }    
   }

   static async getTrainerSearchSuggestions(req:Request,res:Response,next:NextFunction):Promise<void> {
      try {
         const query = req.query.suggestions
         console.log(req.query)
         const trainersNames= await user.getTrainerSearchSuggestions(query as string)
         sendResponse(res,HttpStatusCodes.OK,trainersNames,HttpStatusMessages.TrainersList);
      } catch (error) {
         console.log(`Error in retrieving trainer suggestions : ${error}`);
         next(error)
       }    
   }


}