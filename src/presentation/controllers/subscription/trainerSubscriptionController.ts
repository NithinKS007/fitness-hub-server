import { Request, Response } from "express-serve-static-core";
import { sendResponse } from "../../../shared/utils/httpResponse";
import {
  HttpStatusCodes,
  SubscriptionStatus,
} from "../../../shared/constants/index-constants";
import { StripePaymentService } from "../../../infrastructure/services/payments/stripeServices";
import { MongoUserSubscriptionPlanRepository } from "../../../infrastructure/databases/repositories/userSubscriptionRepository";
import { MongoSubscriptionRepository } from "../../../infrastructure/databases/repositories/subscriptionRepository";
import { GetTrainerSubscriptionUseCase } from "../../../application/usecases/subscription/getTrainerSubscriptionUseCase";

//MONGO REPOSITORY INSTANCES
const monogUserSubscriptionPlanRepository =
  new MongoUserSubscriptionPlanRepository();
const mongoSubscriptionRepository = new MongoSubscriptionRepository();

//SERVICE INSTANCES
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
    res: Response
  ): Promise<void> {
    const trainerId = req.user._id;
    const subscriptionsData =
      await getTrainerSubscriptionUseCase.getTrainerSubscriptions(trainerId);
    sendResponse(
      res,
      HttpStatusCodes.OK,
      subscriptionsData,
      SubscriptionStatus.SubscriptionsListRetrieved
    );
  }

  static async getTrainerSubscribedUsers(
    req: Request,
    res: Response
  ): Promise<void> {
    const trainerId = req.user._id;
    const { page, limit, search, filters } = req.query;
    const { trainerSubscribers, paginationData } =
      await getTrainerSubscriptionUseCase.getTrainerSubscribedUsers(trainerId, {
        page: page as string,
        search: search as string,
        limit: limit as string,
        filters: filters as string[],
      });
    sendResponse(
      res,
      HttpStatusCodes.OK,
      { trainerSubscribers, paginationData },
      SubscriptionStatus.SubscriptionsListRetrieved
    );
  }
}
