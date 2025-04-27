import { NextFunction, Request, Response } from "express-serve-static-core";
import { sendResponse } from "../../../shared/utils/httpResponse";
import {
  HttpStatusCodes,
  SubscriptionStatusMessage,
} from "../../../shared/constants/httpResponseStructure";
import { StripePaymentService } from "../../../infrastructure/services/payments/stripeServices";
import { LoggerService } from "../../../infrastructure/logging/logger";
import { LoggerHelper } from "../../../shared/utils/handleLog";
import { MongoUserSubscriptionPlanRepository } from "../../../infrastructure/databases/repositories/userSubscriptionRepository";
import { MongoSubscriptionRepository } from "../../../infrastructure/databases/repositories/subscriptionRepository";
import { GetTrainerSubscriptionUseCase } from "../../../application/usecases/subscription/getTrainerSubscriptionUseCase";

//MONGO REPOSITORY INSTANCES
const monogUserSubscriptionPlanRepository =
  new MongoUserSubscriptionPlanRepository();
const mongoSubscriptionRepository = new MongoSubscriptionRepository();

//SERVICE INSTANCES
const logger = new LoggerService();
const loggerHelper = new LoggerHelper(logger);
const stripeService = new StripePaymentService();

//USE CASE INSTANCES
const getTrainerSubscriptionUseCase = new GetTrainerSubscriptionUseCase(
  mongoSubscriptionRepository,
  monogUserSubscriptionPlanRepository,
  stripeService
);

export class TrainerSubscriptionController {
  static async getTrainerSubscriptions(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const trainerId = req.user._id;
      const subscriptionsData =
        await getTrainerSubscriptionUseCase.getTrainerSubscriptions(trainerId);
      sendResponse(
        res,
        HttpStatusCodes.OK,
        subscriptionsData,
        SubscriptionStatusMessage.SubscriptionsListRetrieved
      );
    } catch (error) {
      loggerHelper.handleLogError(
        error,
        "TrainerSubscriptionController.getTrainerSubscriptions",
        "Error retrieving trainer subscriptions"
      );
      next(error);
    }
  }

  static async getTrainerSubscribedUsers(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const trainerId = req.user._id;
      const { page, limit, search, filters } = req.query;
      const { trainerSubscribers, paginationData } =
        await getTrainerSubscriptionUseCase.getTrainerSubscribedUsers(
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
        SubscriptionStatusMessage.SubscriptionsListRetrieved
      );
    } catch (error) {
      loggerHelper.handleLogError(
        error,
        "TrainerSubscriptionController.getTrainerSubscribedUsers",
        "Error retrieving trainer's subscribed users list"
      );
      next(error);
    }
  }
}
