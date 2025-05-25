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
import { TrainerGetUseCase } from "../../../application/usecases/trainer/trainerGetUseCase";
import { RevenueUseCase } from "../../../application/usecases/revenue/revenueUseCase";
import { GetTrainerSubscriptionUseCase } from "../../../application/usecases/subscription/getTrainerSubscriptionUseCase";
import { TrainerApprovalUseCase } from "../../../application/usecases/trainer/trainerApprovalUseCase";


export class AdminController {
  constructor(
    private userUseCase: UserUseCase,
    private trainerGetUseCase: TrainerGetUseCase,
    private revenueUseCase: RevenueUseCase,
    private getTrainerSubscriptionUseCase: GetTrainerSubscriptionUseCase,
    private trainerApprovalUseCase: TrainerApprovalUseCase
  ) {}
  public async getUsers(req: Request, res: Response): Promise<void> {
    const { page, limit, search, filters } = req.query;
    const { usersList, paginationData } = await this.userUseCase.getUsers({
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

  public async getUserDetails(req: Request, res: Response): Promise<void> {
    const userId = req.params.userId;
    const userData = await this.userUseCase.getUserDetails(userId);
    sendResponse(
      res,
      HttpStatusCodes.OK,
      userData,
      ProfileStatus.UserDataRetrieved
    );
  }

  public async getTrainers(req: Request, res: Response): Promise<void> {
    const { page, limit, search, filters } = req.query;
    const { trainersList, paginationData } =
      await this.trainerGetUseCase.getTrainers({
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
  public async getTrainerDetails(req: Request, res: Response): Promise<void> {
    const trainerId = req.params.trainerId;
    const trainerData = await this.trainerGetUseCase.getTrainerDetailsById(
      trainerId
    );
    sendResponse(
      res,
      HttpStatusCodes.OK,
      trainerData,
      TrainerStatus.TrainerDetailsRetrieved
    );
  }
  public async updateBlockStatus(req: Request, res: Response): Promise<void> {
    const { userId } = req.params;
    const { isBlocked } = req.body;
    const updatedData = await this.userUseCase.updateBlockStatus({
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

  public async getPendingList(
    req: Request,
    res: Response
  ): Promise<void> {
    const { search, fromDate, toDate, page, limit } = req.query;
    const { trainersList, paginationData } =
      await this.trainerApprovalUseCase.getPendingList({
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
  public async handleVerification(
    req: Request,
    res: Response
  ): Promise<void> {
    const trainerId = req.params.trainerId;
    const { action } = req.body;
    const updatedTrainerData =
      await this.trainerApprovalUseCase.handleVerification({
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
  public async getTrainerSubscriptions(
    req: Request,
    res: Response
  ): Promise<void> {
    const trainerId = req.params.trainerId;
    const subscriptionsData =
      await this.getTrainerSubscriptionUseCase.getTrainerSubscriptions(trainerId);
    sendResponse(
      res,
      HttpStatusCodes.OK,
      subscriptionsData,
      SubscriptionStatus.SubscriptionsListRetrieved
    );
  }

  public async getAdminRevenueHistory(
    req: Request,
    res: Response
  ): Promise<void> {
    const { fromDate, toDate, page, limit, search, filters } = req.query;
    const { revenueData, paginationData } =
      await this.revenueUseCase.getAdminRevenueHistory({
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
