import { Request, Response } from "express";
import { sendResponse } from "../../../shared/utils/httpResponse";
import {
  HttpStatusCodes,
  SubscriptionStatus,
} from "../../../shared/constants/index-constants";
import { PurchaseSubscriptionUseCase } from "../../../application/usecases/subscription/purchaseSubscriptionUseCase";
import { WebHookHandlerUseCase } from "../../../application/usecases/subscription/webhookHandlerUseCase";

export class WebhookController {
  constructor(
    private webHookHandlerUseCase: WebHookHandlerUseCase,
    private purchaseSubscriptionUseCase: PurchaseSubscriptionUseCase
  ) {}
  public async webHookHandler(req: Request, res: Response): Promise<void> {
    const sig = req.headers["stripe-signature"];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRETKEY;
    await this.webHookHandlerUseCase.webHookHandler(
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

  public async getSubscriptionBySession(
    req: Request,
    res: Response
  ): Promise<void> {
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
