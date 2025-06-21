import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import {
  StatusCodes,
  SubscriptionStatus,
} from "@shared/constants/index.constants";
import { WebHookHandlerUseCase } from "@application/usecases/subscription/webhook-handler.usecase";
import { TYPES_SUBSCRIPTION_USECASES } from "@di/types-usecases";

@injectable()
export class WebhookController {
  constructor(
    @inject(TYPES_SUBSCRIPTION_USECASES.WebHookHandlerUseCase)
    private webHookHandlerUseCase: WebHookHandlerUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const sig = req.headers["stripe-signature"];

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRETKEY;

    await this.webHookHandlerUseCase.execute(
      sig as string,
      webhookSecret as string,
      req.body
    );

    sendResponse(res, StatusCodes.OK, null, SubscriptionStatus.Created);
  }
}
