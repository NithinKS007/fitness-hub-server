import { NextFunction,Request,Response } from "express";
import { MongoUserRepository } from "../../infrastructure/databases/repositories/mongouserRepository";
import { HttpStatusCodes, HttpStatusMessages } from "../../shared/constants/httpResponseStructure";
import { sendResponse } from "../../shared/utils/httpResponse";
import { UpdateProfileUseCase } from "../../domain/usecases/updateProfileUseCase";
import { MonogTrainerRepository } from "../../infrastructure/databases/repositories/mongoTrainerRepository";

const mongoUserRepository = new MongoUserRepository()
const monogTrainerRepository = new MonogTrainerRepository()
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
}