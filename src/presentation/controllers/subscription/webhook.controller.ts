import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import {
  StatusCodes,
  SubscriptionStatus,
} from "@shared/constants/index.constants";
import { TYPES_SUBSCRIPTION_USECASES } from "@di/types-usecases";
import { IWebHookHandlerUC } from "@application/interfaces/usecases/ISubscriptionUC";
import { UnauthorizedError } from "@presentation/middlewares/error.middleware";

@injectable()
export class WebhookController {
  constructor(
    @inject(TYPES_SUBSCRIPTION_USECASES.WebHookHandlerUseCase)
    private webHookHandlerUseCase: IWebHookHandlerUC
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const sig = req.headers["stripe-signature"];

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRETKEY;

    if (typeof sig !== "string" || !webhookSecret || !req.body) {
      throw new UnauthorizedError("Invalid webhook signature");
    }

    await this.webHookHandlerUseCase.execute({
      sig,
      webhookSecret,
      body: req.body,
    });

    sendResponse(res, StatusCodes.OK, null, SubscriptionStatus.Created);
  }
}
