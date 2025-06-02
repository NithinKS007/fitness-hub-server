import { Request, Response } from "express";
import { sendResponse } from "../../../shared/utils/http.response";
import {
  HttpStatusCodes,
  SubscriptionStatus,
} from "../../../shared/constants/index.constants";
import { GetUserSubscriptionUseCase } from "../../../application/usecases/subscription/get-user-subscription.usecase";
import { CheckSubscriptionStatusUseCase } from "../../../application/usecases/subscription/check-subscription-status.usecase";
import { parseQueryParams } from "../../../shared/utils/parse.queryParams";

export class UserSubscriptionController {
  constructor(
    private getUserSubscriptionUseCase: GetUserSubscriptionUseCase,
    private checkSubscriptionStatusUseCase: CheckSubscriptionStatusUseCase
  ) {}
  async getUserSubscriptions(req: Request, res: Response): Promise<void> {
    const userId = req?.user?._id;
    const queryParams = parseQueryParams(req.query);
    const { userSubscriptionsList, paginationData } =
      await this.getUserSubscriptionUseCase.getUserSubscriptionsData(
        userId,
        queryParams
      );
    sendResponse(
      res,
      HttpStatusCodes.OK,
      { userSubscriptionsList, paginationData },
      SubscriptionStatus.SubscriptionListOfUserRetrievedSuccessfully
    );
  }

  async isSubscribedToTheTrainer(req: Request, res: Response): Promise<void> {
    const userId = req?.user?._id;
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
