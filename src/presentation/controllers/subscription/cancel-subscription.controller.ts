import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import {
  StatusCodes,
  SubscriptionStatus,
} from "@shared/constants/index.constants";
import { CancelSubscriptionUseCase } from "@application/usecases/subscription/cancel-subscription.usecase";
import { TYPES_SUBSCRIPTION_USECASES } from "di/types-usecases";

@injectable()
export class CancelSubscriptionController {
  constructor(
    @inject(TYPES_SUBSCRIPTION_USECASES.CancelSubscriptionUseCase)
    private cancelSubscriptionUseCase: CancelSubscriptionUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
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
