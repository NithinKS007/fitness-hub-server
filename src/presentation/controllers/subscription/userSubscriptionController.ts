import { Request, Response } from "express-serve-static-core";
import { sendResponse } from "../../../shared/utils/httpResponse";
import {
  HttpStatusCodes,
  SubscriptionStatus,
} from "../../../shared/constants/index-constants";
import { MongoUserSubscriptionPlanRepository } from "../../../infrastructure/databases/repositories/userSubscriptionRepository";
import { StripePaymentService } from "../../../infrastructure/services/payments/stripeServices";
import { GetUserSubscriptionUseCase } from "../../../application/usecases/subscription/getUserSubscriptionUseCase";
import { CheckSubscriptionStatusUseCase } from "../../../application/usecases/subscription/checkSubscriptionStatusUseCase";

//MONGO REPOSITORY INSTANCES
const monogUserSubscriptionPlanRepository =
  new MongoUserSubscriptionPlanRepository();

//SERVICE INSTANCES
const stripeService = new StripePaymentService();

//USE CASE INSTANCES
const getUserSubscriptionUseCase = new GetUserSubscriptionUseCase(
  monogUserSubscriptionPlanRepository,
  stripeService
);

const checkSubscriptionStatusUseCase = new CheckSubscriptionStatusUseCase(
  monogUserSubscriptionPlanRepository,
  stripeService
);

export class UserSubscriptionController {
  static async getUserSubscriptions(
    req: Request,
    res: Response
  ): Promise<void> {
    const userId = req.user._id;
    const { page, limit, search, filters } = req.query;
    const { userSubscriptionsList, paginationData } =
      await getUserSubscriptionUseCase.getUserSubscriptionsData(userId, {
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

  static async isSubscribedToTheTrainer(
    req: Request,
    res: Response
  ): Promise<void> {
    const userId = req.user._id;
    const trainerId = req.params._id;
    const isUserSubscribedToTheTrainer =
      await checkSubscriptionStatusUseCase.isUserSubscribedToTheTrainer({
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
