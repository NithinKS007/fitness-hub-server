import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../shared/utils/httpResponse";
import {
  HttpStatusCodes,
  HttpStatusMessages,
} from "../../shared/constants/httpResponseStructure";
import { MongoUserRepository } from "../../infrastructure/databases/repositories/mongouserRepository";
import { UserUseCase } from "../../domain/usecases/userUseCase";
import { MongoSubscriptionRepository } from "../../infrastructure/databases/repositories/mongoSubscriptionRepository";

const mongouserRepository = new MongoUserRepository();
const mongoSubscriptionRepository = new MongoSubscriptionRepository()
const user = new UserUseCase(mongouserRepository,mongoSubscriptionRepository);

export class AdminController {
  static async getUsers(req: Request, res: Response,next:NextFunction): Promise<void> {
    try {
      const usersData = await user.getUsers(req?.query?.role as string);
      sendResponse(
        res,
        HttpStatusCodes.OK,
        usersData,
        HttpStatusMessages.UserList
      );
    } catch (error: any) {
      console.log(`Error in  getUsers : ${error}`);
      next(error)
    }
  }
  static async updateBlockStatus(req: Request, res: Response,next:NextFunction): Promise<void> {
    try {
      let { _id } = req.params;
      const { isBlocked } = req.body;
      const userData = await user.updateBlockStatus({ _id, isBlocked });
      sendResponse(
        res,
        HttpStatusCodes.OK,
        userData,
        HttpStatusMessages.BlockStatusUpdated
      );
    } catch (error: any) {
      console.log(`Error in  failed to update block status : ${error}`);
       next(error)
    }
  }
  static async trainerVerification(req: Request, res: Response,next:NextFunction): Promise<void> {
    try {
      const { _id } = req.params;
      const { action } = req.body;
      const updatedTrainerData = await user.trainerVerification({
        _id,
        action,
      });
      if (action === "approved") {
        sendResponse(
          res,
          HttpStatusCodes.OK,
          updatedTrainerData,
          HttpStatusMessages.TrainerApproved
        );
      } else {
        sendResponse(
          res,
          HttpStatusCodes.OK,
          updatedTrainerData,
          HttpStatusMessages.TrainerRejected
        );
      }
    } catch (error: any) {
      console.log(`Error to verify trainer : ${error}`);
      next(error)
    }
  }
  static async getUserDetails(req: Request, res: Response,next:NextFunction): Promise<void> {
    try {
      const userData = await user.getUserDetails(req.params._id);
      sendResponse(
        res,
        HttpStatusCodes.OK,
        userData,
        HttpStatusMessages.UserDataRetrieved
      );
    } catch (error: any) {
      console.log(`Failed to get user details: ${error}`);
      next(error)
    }
  }
}
