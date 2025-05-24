import { Request, Response } from "express-serve-static-core";
import { sendResponse } from "../../../shared/utils/httpResponse";
import {
  HttpStatusCodes,
  SubscriptionStatus,
} from "../../../shared/constants/index-constants";
import { MongoUserSubscriptionPlanRepository } from "../../../infrastructure/databases/repositories/userSubscriptionRepository";
import { MongoSubscriptionRepository } from "../../../infrastructure/databases/repositories/subscriptionRepository";
import { StripePaymentService } from "../../../infrastructure/services/payments/stripeServices";
import { PurchaseSubscriptionUseCase } from "../../../application/usecases/subscription/purchaseSubscriptionUseCase";
import { CancelSubscriptionUseCase } from "../../../application/usecases/subscription/cancelSubscriptionUseCase";

//MONGO REPOSITORY INSTANCES
const mongoSubscriptionRepository = new MongoSubscriptionRepository();
const monogUserSubscriptionPlanRepository =
  new MongoUserSubscriptionPlanRepository();

//SERVICE INSTANCES
const stripeService = new StripePaymentService();

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
    res: Response
  ): Promise<void> {
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
  }

  static async cancelSubscription(req: Request, res: Response): Promise<void> {
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
  }
}
