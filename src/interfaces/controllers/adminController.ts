import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../shared/utils/httpResponse";
import {
  HttpStatusCodes,
  HttpStatusMessages,
} from "../../shared/constants/httpResponseStructure";
import { UserUseCase } from "../../application/usecases/userUseCase";
import { TrainerUseCase } from "../../application/usecases/trainerUseCase";
import { SubscriptionUseCase } from "../../application/usecases/subscriptionUseCase";
import { MongoUserRepository } from "../../infrastructure/databases/repositories/mongoUserRepository";
import { MongoTrainerRepository } from "../../infrastructure/databases/repositories/mongoTrainerRepository";
import { MongoSubscriptionRepository } from "../../infrastructure/databases/repositories/mongoSubscriptionRepository";
import { MonogUserSubscriptionPlanRepository } from "../../infrastructure/databases/repositories/mongoUserSubscriptionRepository";

//MONGO REPOSITORY INSTANCES
const mongouserRepository = new MongoUserRepository();
const mongoTrainerRepository = new MongoTrainerRepository()
const mongoSubscriptionRepository = new MongoSubscriptionRepository()
const monogUserSubscriptionPlanRepository = new MonogUserSubscriptionPlanRepository()

//USE CASE INSTANCES
const userUseCase = new UserUseCase(mongouserRepository);
const trainerUsecase = new TrainerUseCase(mongoTrainerRepository)
const subscriptionsUseCase = new SubscriptionUseCase(mongoSubscriptionRepository,mongoTrainerRepository,monogUserSubscriptionPlanRepository)

export class AdminController {
static async getUsers(req: Request, res: Response,next:NextFunction): Promise<void> {
  try {
    const { page,limit,search,filters } = req.query
    const { usersList,paginationData }  = await userUseCase.getUsers({page:page as string,limit:limit as string,
                                          search:search as string,filters:filters as string[]});
    sendResponse(res,HttpStatusCodes.OK,{usersList:usersList,paginationData:paginationData},HttpStatusMessages.UserList);
  } catch (error: any) {
    console.log(`Error fetching users: ${error}`);
    next(error)
  }
}
static async getUserDetails(req: Request, res: Response,next:NextFunction): Promise<void> {
  try {
    const userData = await userUseCase.getUserDetails(req.params._id);
    sendResponse(res,HttpStatusCodes.OK,userData,HttpStatusMessages.UserDataRetrieved);
  } catch (error: any) {
    console.log(`Error retrieving user details (ID: ${req.params._id}): ${error}`);
    next(error)
  }
}

static async getTrainers(req: Request, res: Response,next:NextFunction): Promise<void> {
  try {
    const {page,limit,search,filters} = req.query
    const {trainersList,paginationData} = await trainerUsecase.getTrainers(
                                          {page:page as string,limit:limit as string,
                                          search:search as string,filters:filters as string[]});
    sendResponse(res,HttpStatusCodes.OK,{trainersList:trainersList,paginationData},HttpStatusMessages.TrainersListRetrieved);
  } catch (error: any) {
    console.log(`Error retrieving trainer list: ${error}`);
    next(error)
  }
}
static async getTrainerDetails(req: Request, res: Response,next:NextFunction): Promise<void> {
  try {
    const trainerData = await trainerUsecase.getTrainerDetailsById(req.params._id);
    sendResponse(res,HttpStatusCodes.OK,trainerData,HttpStatusMessages.TrainerDetailsRetrieved);
  } catch (error: any) {
    console.log(`Error retrieving trainer details (ID: ${req.params._id}): ${error}`);
    next(error)
  }
}
static async updateBlockStatus(req: Request, res: Response,next:NextFunction): Promise<void> {
  try {
    const { _id } = req.params;
    const { isBlocked } = req.body;
    const updatedData = await userUseCase.updateBlockStatus({ _id, isBlocked });
    sendResponse(res,HttpStatusCodes.OK,updatedData,HttpStatusMessages.BlockStatusUpdated);
  } catch (error: any) {
    console.log(`Error updating block status (ID: ${req.params._id}): ${error}`);
    next(error)
  }
}

static async getPendingTrainerApprovals(req: Request, res: Response,next:NextFunction): Promise<void> {
  try {

    const {search,fromDate,toDate, page,limit} = req.query

    console.log("query received for filtering in approval list",search,fromDate,toDate,page,limit)
    const {trainersList,paginationData} = await trainerUsecase.getApprovalPendingList({search:search as string,fromDate:fromDate as any,toDate:toDate as any,page:page as string,limit:limit as string})
    
    sendResponse(res,HttpStatusCodes.OK,{trainersList:trainersList,paginationData:paginationData},HttpStatusMessages.TrainersListRetrieved)
  } catch (error: any) {
    console.log(`Error fetching trainer approval list: ${error}`);
    next(error)
  }
}
static async approveRejectTrainerVerification(req: Request, res: Response,next:NextFunction): Promise<void> {
  try {
    const { _id } = req.params;
    const { action } = req.body;
    const updatedTrainerData = await trainerUsecase.approveRejectTrainerVerification({_id,action});
    if (action === "approved") {
      sendResponse(res,HttpStatusCodes.OK,updatedTrainerData,HttpStatusMessages.TrainerApproved);
    } else {
      sendResponse(res,HttpStatusCodes.OK,updatedTrainerData,HttpStatusMessages.TrainerRejected);
    }
  } catch (error: any) {
    console.log(`Error verifying trainer (ID: ${req.params._id}): ${error}`);
    next(error)
  }
}
static async getTrainerSubscriptions(req: Request, res: Response,next:NextFunction): Promise<void> {
  try {
    const { _id } = req.params;
    const subscriptionsData = await subscriptionsUseCase.getTrainerSubscriptions(_id);
    sendResponse(res, HttpStatusCodes.OK, subscriptionsData, HttpStatusMessages.SubscriptionsListRetrieved);
  } catch (error: any) {
    console.log(`Error retrieving subscriptions for trainer (ID: ${req.params._id}): ${error}`);
    next(error)
  }
}
}
