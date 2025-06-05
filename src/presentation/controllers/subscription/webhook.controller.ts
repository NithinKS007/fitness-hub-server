import { Request, Response } from "express";
import { sendResponse } from "../../../shared/utils/http.response";
import {
  HttpStatusCodes,
  SubscriptionStatus,
} from "../../../shared/constants/index.constants";
import { PurchaseSubscriptionUseCase } from "../../../application/usecases/subscription/purchase-subscription.usecase";
import { WebHookHandlerUseCase } from "../../../application/usecases/subscription/webhook-handler.usecase";

export class WebhookController {
  constructor(
    private webHookHandlerUseCase: WebHookHandlerUseCase,
    private purchaseSubscriptionUseCase: PurchaseSubscriptionUseCase
  ) {}
  async webHookHandler(req: Request, res: Response): Promise<void> {
    const sig = req.headers["stripe-signature"];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRETKEY;
    await this.webHookHandlerUseCase.execute(
      sig as string,
      webhookSecret as string,
      req.body
    );
    sendResponse(
      res,
      HttpStatusCodes.OK,
      null,
      SubscriptionStatus.SubscriptionAddedSuccessfully
    );
  }

  async getSubscriptionBySession(req: Request, res: Response): Promise<void> {
    const { sessionId } = req.params;
    const subscriptionData =
      await this.purchaseSubscriptionUseCase.getSubscriptionBySession(
        sessionId
      );
    sendResponse(
      res,
      HttpStatusCodes.OK,
      { subscriptionData: subscriptionData },
      SubscriptionStatus.SubscriptionAddedSuccessfully
    );
  }
}
