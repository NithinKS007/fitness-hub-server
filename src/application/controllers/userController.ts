import { NextFunction,Request,Response } from "express";
import { UpdateProfileUseCase } from "../../domain/usecases/updateProfileUseCase";
import { MonogTrainerRepository } from "../../infrastructure/databases/repositories/mongoTrainerRepository";
import { MongoUserRepository } from "../../infrastructure/databases/repositories/mongouserRepository";
import { sendResponse } from "../../shared/utils/httpResponse";
import { HttpStatusCodes, HttpStatusMessages } from "../../shared/constants/httpResponseStructure";
import { TrainerUseCase } from "../../domain/usecases/trainerUseCase";

const mongoUserRepository = new MongoUserRepository()
const monogTrainerRepository = new MonogTrainerRepository()
const profileUseCase = new UpdateProfileUseCase(mongoUserRepository,monogTrainerRepository)
const trainerUseCase = new TrainerUseCase(monogTrainerRepository)

export class UserController {

    static async updateUserProfile(req:Request,res:Response,next:NextFunction):Promise<void>{
        try {
            const {_id} = req.user
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
           const trainersData = await trainerUseCase.getApprovedTrainers()
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


    
}