import { NextFunction, Request, Response } from "express-serve-static-core";
import { sendResponse } from "../../../shared/utils/httpResponse";
import {
  HttpStatusCodes,
  SubscriptionStatus,
} from "../../../shared/constants/index-constants";
import { MongoUserSubscriptionPlanRepository } from "../../../infrastructure/databases/repositories/userSubscriptionRepository";
import { MongoSubscriptionRepository } from "../../../infrastructure/databases/repositories/subscriptionRepository";
import { StripePaymentService } from "../../../infrastructure/services/payments/stripeServices";
import { LoggerService } from "../../../infrastructure/logging/logger";
import { LoggerHelper } from "../../../shared/utils/handleLog";
import { PurchaseSubscriptionUseCase } from "../../../application/usecases/subscription/purchaseSubscriptionUseCase";
import { CancelSubscriptionUseCase } from "../../../application/usecases/subscription/cancelSubscriptionUseCase";

//MONGO REPOSITORY INSTANCES
const mongoSubscriptionRepository = new MongoSubscriptionRepository();
const monogUserSubscriptionPlanRepository =
  new MongoUserSubscriptionPlanRepository();

//SERVICE INSTANCES
const stripeService = new StripePaymentService();
const logger = new LoggerService();
const loggerHelper = new LoggerHelper(logger);

//USE CASE INSTANCES
const purchaseSubscriptionUseCase = new PurchaseSubscriptionUseCase(
  mongoSubscriptionRepository,
  monogUserSubscriptionPlanRepository,
  stripeService
);
const cancelSubscriptionUseCase = new CancelSubscriptionUseCase(stripeService);

export class PurchaseSubscriptionController {
  static async purchaseSubscription(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user._id;
      const { subscriptionId } = req.body;
      const sessionId = await purchaseSubscriptionUseCase.createStripeSession({
        userId: userId,
        subscriptionId,
      });
      sendResponse(
        res,
        HttpStatusCodes.OK,
        { sessionId: sessionId },
        SubscriptionStatus.SubscriptionAddedSuccessfully
      );
    } catch (error) {
      loggerHelper.handleLogError(
        error,
        "PurchaseSubscriptionController.purchaseSubscription",
        "Error purchasing subscription"
      );
      next(error);
    }
  }

  static async cancelSubscription(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { stripeSubscriptionId, action } = req.body;
      const subscriptionCancelledData =
        await cancelSubscriptionUseCase.cancelSubscription({
          stripeSubscriptionId,
          action,
        });
      sendResponse(
        res,
        HttpStatusCodes.OK,
        { subscriptionCancelledData: subscriptionCancelledData },
        SubscriptionStatus.SubscriptionCancelledSuccessfully
      );
    } catch (error) {
      loggerHelper.handleLogError(
        error,
        "PurchaseSubscriptionController.cancelSubscription",
        "Error canceling subscription"
      );
      next(error);
    }
  }
}
