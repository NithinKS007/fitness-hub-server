import { Request, Response } from "express";
import { sendResponse } from "../../../shared/utils/httpResponse";
import {
  HttpStatusCodes,
  SubscriptionStatus,
} from "../../../shared/constants/index-constants";
import { PurchaseSubscriptionUseCase } from "../../../application/usecases/subscription/purchaseSubscriptionUseCase";
import { CancelSubscriptionUseCase } from "../../../application/usecases/subscription/cancelSubscriptionUseCase";

export class PurchaseSubscriptionController {
  constructor(
    private purchaseSubscriptionUseCase: PurchaseSubscriptionUseCase,
    private cancelSubscriptionUseCase: CancelSubscriptionUseCase
  ) {}
  public async purchaseSubscription(
    req: Request,
    res: Response
  ): Promise<void> {
    const userId = req.user._id;
    const { subscriptionId } = req.body;
    const sessionId =
      await this.purchaseSubscriptionUseCase.createStripeSession({
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

  public async cancelSubscription(req: Request, res: Response): Promise<void> {
    const { stripeSubscriptionId, action } = req.body;
    const subscriptionCancelledData =
      await this.cancelSubscriptionUseCase.cancelSubscription({
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
