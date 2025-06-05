import { Request, Response } from "express";
import { sendResponse } from "../../../shared/utils/http.response";
import {
  HttpStatusCodes,
  SubscriptionStatus,
} from "../../../shared/constants/index.constants";
import { PurchaseSubscriptionUseCase } from "../../../application/usecases/subscription/purchase-subscription.usecase";
import { CancelSubscriptionUseCase } from "../../../application/usecases/subscription/cancel-subscription.usecase";

export class PurchaseSubscriptionController {
  constructor(
    private purchaseSubscriptionUseCase: PurchaseSubscriptionUseCase,
    private cancelSubscriptionUseCase: CancelSubscriptionUseCase
  ) {}
  async purchaseSubscription(req: Request, res: Response): Promise<void> {
    const userId = req?.user?._id;
    const subscriptionId = req.body.subscriptionId;
    const sessionId =
      await this.purchaseSubscriptionUseCase.createStripeSession({
        userId,
        subscriptionId,
      });
    sendResponse(
      res,
      HttpStatusCodes.OK,
      { sessionId: sessionId },
      SubscriptionStatus.SubscriptionAddedSuccessfully
    );
  }

  async cancelSubscription(req: Request, res: Response): Promise<void> {
    const { stripeSubscriptionId, action } = req.body;
    const cancelSubData = { stripeSubscriptionId, action };
    const subscriptionCancelledData =
      await this.cancelSubscriptionUseCase.execute(cancelSubData);
    sendResponse(
      res,
      HttpStatusCodes.OK,
      { subscriptionCancelledData: subscriptionCancelledData },
      SubscriptionStatus.SubscriptionCancelledSuccessfully
    );
  }
}
