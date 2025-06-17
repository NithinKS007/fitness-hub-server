import { Request, Response } from "express";
import { sendResponse } from "@shared/utils/http.response";
import {
  StatusCodes,
  SubscriptionStatus,
} from "@shared/constants/index.constants";
import { PurchaseSubscriptionUseCase } from "@application/usecases/subscription/purchase-subscription.usecase";

export class PurchaseSubscriptionController {
  constructor(
    private purchaseSubscriptionUseCase: PurchaseSubscriptionUseCase
  ) {}

  async handlePurchase(req: Request, res: Response): Promise<void> {
    const { _id: userId } = req?.user || {};
    const { subscriptionId } = req.body;

    const sessionId = await this.purchaseSubscriptionUseCase.execute({
      userId,
      subscriptionId,
    });

    sendResponse(
      res,
      StatusCodes.OK,
      { sessionId: sessionId },
      SubscriptionStatus.SubscriptionAddedSuccess
    );
  }
}
