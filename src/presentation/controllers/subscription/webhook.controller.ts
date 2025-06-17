import { Request, Response } from "express";
import { sendResponse } from "@shared/utils/http.response";
import {
  StatusCodes,
  SubscriptionStatus,
} from "@shared/constants/index.constants";
import { WebHookHandlerUseCase } from "@application/usecases/subscription/webhook-handler.usecase";

export class WebhookController {
  constructor(private webHookHandlerUseCase: WebHookHandlerUseCase) {}

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
      StatusCodes.OK,
      null,
      SubscriptionStatus.SubscriptionAddedSuccess
    );
  }
}
