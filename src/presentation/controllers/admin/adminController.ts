import { Request, Response } from "express";
import { sendResponse } from "../../../shared/utils/httpResponse";
import {
  BlockStatus,
  ProfileStatus,
  RevenueStatus,
  SubscriptionStatus,
  TrainerStatus,
  UserStatus,
  HttpStatusCodes,
} from "../../../shared/constants/index-constants";
import { UserUseCase } from "../../../application/usecases/user/userUseCase";
import { TrainerUseCase } from "../../../application/usecases/trainer/trainerUseCase";
import { MongoUserRepository } from "../../../infrastructure/databases/repositories/userRepository";
import { MongoTrainerRepository } from "../../../infrastructure/databases/repositories/trainerRepository";
import { MongoSubscriptionRepository } from "../../../infrastructure/databases/repositories/subscriptionRepository";
import { MongoUserSubscriptionPlanRepository } from "../../../infrastructure/databases/repositories/userSubscriptionRepository";
import { MongoRevenueRepository } from "../../../infrastructure/databases/repositories/revenueRepository";
import { RevenueUseCase } from "../../../application/usecases/revenue/revenueUseCase";
import { StripePaymentService } from "../../../infrastructure/services/payments/stripeServices";
import { GetTrainerSubscriptionUseCase } from "../../../application/usecases/subscription/getTrainerSubscriptionUseCase";

//MONGO REPOSITORY INSTANCES
const mongouserRepository = new MongoUserRepository();
const mongoTrainerRepository = new MongoTrainerRepository();
const mongoSubscriptionRepository = new MongoSubscriptionRepository();
const monogUserSubscriptionPlanRepository =
  new MongoUserSubscriptionPlanRepository();
const mongoRevenueRepository = new MongoRevenueRepository();

//USE CASE INSTANCES
const userUseCase = new UserUseCase(mongouserRepository);
const trainerUsecase = new TrainerUseCase(mongoTrainerRepository);
const revenueUseCase = new RevenueUseCase(mongoRevenueRepository);
const stripeService = new StripePaymentService();

const getTrainerSubscriptionUseCase = new GetTrainerSubscriptionUseCase(
  mongoSubscriptionRepository,
  monogUserSubscriptionPlanRepository,
  stripeService
);

export class AdminController {
  static async getUsers(req: Request, res: Response): Promise<void> {
    const { page, limit, search, filters } = req.query;
    const { usersList, paginationData } = await userUseCase.getUsers({
      page: page as string,
      limit: limit as string,
      search: search as string,
      filters: filters as string[],
    });
    sendResponse(
      res,
      HttpStatusCodes.OK,
      { usersList: usersList, paginationData: paginationData },
      UserStatus.UserList
    );
  }

  static async getUserDetails(req: Request, res: Response): Promise<void> {
    const userId = req.params.userId;
    const userData = await userUseCase.getUserDetails(userId);
    sendResponse(
      res,
      HttpStatusCodes.OK,
      userData,
      ProfileStatus.UserDataRetrieved
    );
  }

  static async getTrainers(req: Request, res: Response): Promise<void> {
    const { page, limit, search, filters } = req.query;
    const { trainersList, paginationData } = await trainerUsecase.getTrainers({
      page: page as string,
      limit: limit as string,
      search: search as string,
      filters: filters as string[],
    });
    sendResponse(
      res,
      HttpStatusCodes.OK,
      { trainersList: trainersList, paginationData },
      TrainerStatus.TrainersListRetrieved
    );
  }
  static async getTrainerDetails(req: Request, res: Response): Promise<void> {
    const trainerId = req.params.trainerId;
    const trainerData = await trainerUsecase.getTrainerDetailsById(trainerId);
    sendResponse(
      res,
      HttpStatusCodes.OK,
      trainerData,
      TrainerStatus.TrainerDetailsRetrieved
    );
  }
  static async updateBlockStatus(req: Request, res: Response): Promise<void> {
    const { userId } = req.params;
    const { isBlocked } = req.body;
    const updatedData = await userUseCase.updateBlockStatus({
      userId,
      isBlocked,
    });
    sendResponse(
      res,
      HttpStatusCodes.OK,
      updatedData,
      BlockStatus.BlockStatusUpdated
    );
  }

  static async getPendingTrainerApprovals(
    req: Request,
    res: Response
  ): Promise<void> {
    const { search, fromDate, toDate, page, limit } = req.query;
    const { trainersList, paginationData } =
      await trainerUsecase.getApprovalPendingList({
        search: search as string,
        fromDate: fromDate as any,
        toDate: toDate as any,
        page: page as string,
        limit: limit as string,
      });

    sendResponse(
      res,
      HttpStatusCodes.OK,
      { trainersList: trainersList, paginationData: paginationData },
      TrainerStatus.TrainersListRetrieved
    );
  }
  static async approveRejectTrainerVerification(
    req: Request,
    res: Response
  ): Promise<void> {
    const trainerId = req.params.trainerId;
    const { action } = req.body;
    const updatedTrainerData =
      await trainerUsecase.approveRejectTrainerVerification({
        trainerId,
        action,
      });
    if (action === "approved") {
      sendResponse(
        res,
        HttpStatusCodes.OK,
        updatedTrainerData,
        TrainerStatus.TrainerApproved
      );
    } else {
      sendResponse(
        res,
        HttpStatusCodes.OK,
        updatedTrainerData,
        TrainerStatus.TrainerRejected
      );
    }
  }
  static async getTrainerSubscriptions(
    req: Request,
    res: Response
  ): Promise<void> {
    const trainerId = req.params.trainerId;
    const subscriptionsData =
      await getTrainerSubscriptionUseCase.getTrainerSubscriptions(trainerId);
    sendResponse(
      res,
      HttpStatusCodes.OK,
      subscriptionsData,
      SubscriptionStatus.SubscriptionsListRetrieved
    );
  }

  static async getAdminRevenueHistory(
    req: Request,
    res: Response
  ): Promise<void> {
    const { fromDate, toDate, page, limit, search, filters } = req.query;
    const { revenueData, paginationData } =
      await revenueUseCase.getAdminRevenueHistory({
        fromDate: fromDate as any,
        toDate: toDate as any,
        page: page as string,
        limit: limit as string,
        search: search as string,
        filters: filters as string[],
      });
    sendResponse(
      res,
      HttpStatusCodes.OK,
      { revenueData: revenueData, paginationData: paginationData },
      RevenueStatus.SuccessFullyFetchedRevenueHistory
    );
  }
}
