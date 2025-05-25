import { Request, Response } from "express";
import { sendResponse } from "../../../shared/utils/httpResponse";
import {
  HttpStatusCodes,
  SubscriptionStatus,
} from "../../../shared/constants/index-constants";
import { GetTrainerSubscriptionUseCase } from "../../../application/usecases/subscription/getTrainerSubscriptionUseCase";

export class TrainerSubscriptionController {
  constructor(
    private getTrainerSubscriptionUseCase: GetTrainerSubscriptionUseCase
  ) {}

  public async getTrainerSubscriptions(
    req: Request,
    res: Response
  ): Promise<void> {
    const trainerId = req.user._id;
    const subscriptionsData =
      await this.getTrainerSubscriptionUseCase.getTrainerSubscriptions(
        trainerId
      );
    sendResponse(
      res,
      HttpStatusCodes.OK,
      subscriptionsData,
      SubscriptionStatus.SubscriptionsListRetrieved
    );
  }

  public async getTrainerSubscribedUsers(
    req: Request,
    res: Response
  ): Promise<void> {
    const trainerId = req.user._id;
    const { page, limit, search, filters } = req.query;
    const { trainerSubscribers, paginationData } =
      await this.getTrainerSubscriptionUseCase.getTrainerSubscribedUsers(
        trainerId,
        {
          page: page as string,
          search: search as string,
          limit: limit as string,
          filters: filters as string[],
        }
      );
    sendResponse(
      res,
      HttpStatusCodes.OK,
      { trainerSubscribers, paginationData },
      SubscriptionStatus.SubscriptionsListRetrieved
    );
  }
}
