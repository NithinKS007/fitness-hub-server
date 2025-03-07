import { NextFunction,Request,Response } from "express";
import { MongoUserRepository } from "../../infrastructure/databases/repositories/mongouserRepository";
import { HttpStatusCodes, HttpStatusMessages } from "../../shared/constants/httpResponseStructure";
import { sendResponse } from "../../shared/utils/httpResponse";
import { UpdateProfileUseCase } from "../../domain/usecases/updateProfileUseCase";
import { MonogTrainerRepository } from "../../infrastructure/databases/repositories/mongoTrainerRepository";
import { SubscriptionUseCase } from "../../domain/usecases/subscriptionUseCase";
import { MongoSubscriptionRepository } from "../../infrastructure/databases/repositories/mongoSubscriptionRepository";
import { MonogUserSubscriptionPlanRepository } from "../../infrastructure/databases/repositories/mongoUserSubscriptionRepository";

const mongoUserRepository = new MongoUserRepository()
const monogTrainerRepository = new MonogTrainerRepository()
const mongoSubscriptionRepository = new MongoSubscriptionRepository()
const mongoUserSubscriptionPlanRepository = new MonogUserSubscriptionPlanRepository() 
const subscriptionUseCase = new SubscriptionUseCase(mongoSubscriptionRepository,monogTrainerRepository,mongoUserSubscriptionPlanRepository)
const profileUseCase = new UpdateProfileUseCase(mongoUserRepository,monogTrainerRepository)


export class TrainerController {
   static async updateTrainerProfile(req: Request, res: Response,next:NextFunction): Promise<void> {
      try {

         const {_id} = req.user
        const updatedTrainerData = await profileUseCase.updateTrainerProfile({_id,...req.body});
        sendResponse(
          res,
          HttpStatusCodes.OK,
          updatedTrainerData,
          HttpStatusMessages.UserDetailsUpdated
        );
      } catch (error: any) {
        console.log(`Error in updating trainer profile: ${error}`);
        next(error)
      }
    }

    static async getTrainerSubscribedUsers(req: Request, res: Response,next:NextFunction): Promise<void> {
      try {

         const {_id} = req.user
        const subscribedUsersList = await subscriptionUseCase.getTrainerSubscribedUsers(_id);
        sendResponse(
          res,
          HttpStatusCodes.OK,
          subscribedUsersList,
          HttpStatusMessages.SubscriptionsListRetrieved
        );
      } catch (error: any) {
        console.log(`Error to get trainers subscribers list: ${error}`);
        next(error)
      }
    }
    
}