import { NextFunction, Request, Response } from "express-serve-static-core";
import { sendResponse } from "../../../shared/utils/httpResponse";
import {
  HttpStatusCodes,
  SubscriptionStatus,
} from "../../../shared/constants/index-constants";
import { MongoUserSubscriptionPlanRepository } from "../../../infrastructure/databases/repositories/userSubscriptionRepository";
import { StripePaymentService } from "../../../infrastructure/services/payments/stripeServices";
import { LoggerService } from "../../../infrastructure/logging/logger";
import { LoggerHelper } from "../../../shared/utils/handleLog";
import { GetUserSubscriptionUseCase } from "../../../application/usecases/subscription/getUserSubscriptionUseCase";
import { CheckSubscriptionStatusUseCase } from "../../../application/usecases/subscription/checkSubscriptionStatusUseCase";

//MONGO REPOSITORY INSTANCES
const monogUserSubscriptionPlanRepository =
  new MongoUserSubscriptionPlanRepository();


//SERVICE INSTANCES
const stripeService = new StripePaymentService();
const logger = new LoggerService();
const loggerHelper = new LoggerHelper(logger);

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
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
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
    } catch (error) {
      loggerHelper.handleLogError(
        error,
        "UserSubscriptionController.getUserSubscriptions",
        "Error retrieving user's subscriptions"
      );
      next(error);
    }
  }

  static async isSubscribedToTheTrainer(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
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
    } catch (error) {
      loggerHelper.handleLogError(
        error,
        "UserSubscriptionController.isSubscribedToTheTrainer",
        "Error checking user's subscription status"
      );
      next(error);
    }
  }
}
