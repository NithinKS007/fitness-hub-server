import { Request, Response } from "express";
import { sendResponse } from "../../../shared/utils/httpResponse";
import {
  HttpStatusCodes,
  SubscriptionStatus,
} from "../../../shared/constants/index-constants";
import { GetUserSubscriptionUseCase } from "../../../application/usecases/subscription/getUserSubscriptionUseCase";
import { CheckSubscriptionStatusUseCase } from "../../../application/usecases/subscription/checkSubscriptionStatusUseCase";

export class UserSubscriptionController {
  constructor(
    private getUserSubscriptionUseCase: GetUserSubscriptionUseCase,
    private checkSubscriptionStatusUseCase: CheckSubscriptionStatusUseCase
  ) {}
  public async getUserSubscriptions(
    req: Request,
    res: Response
  ): Promise<void> {
    const userId = req.user._id;
    const { page, limit, search, filters } = req.query;
    const { userSubscriptionsList, paginationData } =
      await this.getUserSubscriptionUseCase.getUserSubscriptionsData(userId, {
        page: page as string,
        search: search as string,
        limit: limit as string,
        filters: filters as string[],
      });
    sendResponse(
      res,
      HttpStatusCodes.OK,
      { userSubscriptionsList, paginationData },
      SubscriptionStatus.SubscriptionListOfUserRetrievedSuccessfully
    );
  }

  public async isSubscribedToTheTrainer(
    req: Request,
    res: Response
  ): Promise<void> {
    const userId = req.user._id;
    const trainerId = req.params._id;
    const isUserSubscribedToTheTrainer =
      await this.checkSubscriptionStatusUseCase.isUserSubscribedToTheTrainer({
        userId,
        trainerId,
      });
    sendResponse(
      res,
      HttpStatusCodes.OK,
      { isUserSubscribedToTheTrainer },
      SubscriptionStatus.UserIsSubscribed
    );
  }
}
