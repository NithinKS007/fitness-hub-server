import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../shared/utils/httpResponse";
import {
  HttpStatusCodes,
  HttpStatusMessages,
} from "../../shared/constants/httpResponseStructure";
import { MongoUserRepository } from "../../infrastructure/databases/repositories/mongouserRepository";
import { UserUseCase } from "../../domain/usecases/userUseCase";
import { TrainerUseCase } from "../../domain/usecases/trainerUseCase";
import { MonogTrainerRepository } from "../../infrastructure/databases/repositories/mongoTrainerRepository";
import { SubscriptionUseCase } from "../../domain/usecases/subscriptionUseCase";
import { MongoSubscriptionRepository } from "../../infrastructure/databases/repositories/mongoSubscriptionRepository";
import { MonogUserSubscriptionPlanRepository } from "../../infrastructure/databases/repositories/mongoUserSubscriptionRepository";


const mongouserRepository = new MongoUserRepository();
const mongoTrainerRepository = new MonogTrainerRepository()
const mongoSubscriptionRepository = new MongoSubscriptionRepository()
const monogUserSubscriptionPlanRepository = new MonogUserSubscriptionPlanRepository()
const userUseCase = new UserUseCase(mongouserRepository);
const trainerUsecase = new TrainerUseCase(mongoTrainerRepository)
const subscriptionsUseCase = new SubscriptionUseCase(mongoSubscriptionRepository,mongoTrainerRepository,monogUserSubscriptionPlanRepository)

export class AdminController {
  static async getUsers(req: Request, res: Response,next:NextFunction): Promise<void> {
    try {
      const usersData = await userUseCase.getUsers();
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
  static async getUserDetails(req: Request, res: Response,next:NextFunction): Promise<void> {
    try {
      const userData = await userUseCase.getUserDetails(req.params._id);
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

  static async getTrainers(req: Request, res: Response,next:NextFunction): Promise<void> {
    try {
      const trainersData = await trainerUsecase.getTrainers();
      sendResponse(
        res,
        HttpStatusCodes.OK,
        trainersData,
        HttpStatusMessages.TrainersListRetrieved
      );
    } catch (error: any) {
      console.log(`Error in  getTrainers : ${error}`);
      next(error)
    }
  }
  static async getTrainerDetails(req: Request, res: Response,next:NextFunction): Promise<void> {
    try {
      const trainerData = await trainerUsecase.getTrainerDetailsById(req.params._id);
      sendResponse(
        res,
        HttpStatusCodes.OK,
        trainerData,
        HttpStatusMessages.TrainerDetailsRetrieved
      );
    } catch (error: any) {
      console.log(`Failed to get trainer details: ${error}`);
      next(error)
    }
  }
  static async updateBlockStatus(req: Request, res: Response,next:NextFunction): Promise<void> {
    try {
      let { _id } = req.params;
      const { isBlocked } = req.body;
      const userData = await userUseCase.updateBlockStatus({ _id, isBlocked });
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

  static async getApprovalPendingList(req: Request, res: Response,next:NextFunction): Promise<void> {

    try {
      const trainersList = await trainerUsecase.getApprovalPendingList()
      sendResponse(res,HttpStatusCodes.OK,trainersList,HttpStatusMessages.TrainersListRetrieved)
    } catch (error: any) {
      console.log(`Error to get trainer list to approve : ${error}`);
      next(error)
    }
  }
  static async approveRejectTrainerVerification(req: Request, res: Response,next:NextFunction): Promise<void> {
    try {
      const { _id } = req.params;
      const { action } = req.body;
      const updatedTrainerData = await trainerUsecase.approveRejectTrainerVerification({
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
 static async getTrainerSubscriptions(req: Request, res: Response,next:NextFunction): Promise<void> {
    try {
      const { _id } = req.params;
      const subscriptionsData = await subscriptionsUseCase.getTrainerSubscriptions(_id);
      sendResponse(res, HttpStatusCodes.OK, subscriptionsData, HttpStatusMessages.SubscriptionsListRetrieved);
    } catch (error: any) {
      console.log(`Error to retrieve subscriptions only list : ${error}`);
      next(error)
    }
  }
  

}
