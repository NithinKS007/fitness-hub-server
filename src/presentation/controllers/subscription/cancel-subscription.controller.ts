import { Request, Response } from "express";
import { sendResponse } from "@shared/utils/http.response";
import {
  StatusCodes,
  SubscriptionStatus,
} from "@shared/constants/index.constants";
import { CancelSubscriptionUseCase } from "@application/usecases/subscription/cancel-subscription.usecase";

export class CancelSubscriptionController {
  constructor(private cancelSubscriptionUseCase: CancelSubscriptionUseCase) {}

  async handleCancelSubscription(req: Request, res: Response): Promise<void> {
    const { stripeSubscriptionId, action } = req.body;

    const cancelSubData = { stripeSubscriptionId, action };

    const subscriptionCancelledData =
      await this.cancelSubscriptionUseCase.execute(cancelSubData);

    sendResponse(
      res,
      StatusCodes.OK,
      { subscriptionCancelledData: subscriptionCancelledData },
      SubscriptionStatus.SubscriptionCancelledSuccessfully
    );
  }
}
