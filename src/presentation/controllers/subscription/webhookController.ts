import { Request, Response } from "express-serve-static-core";
import { sendResponse } from "../../../shared/utils/httpResponse";
import {
  HttpStatusCodes,
  SubscriptionStatus,
} from "../../../shared/constants/index-constants";
import { MongoUserSubscriptionPlanRepository } from "../../../infrastructure/databases/repositories/userSubscriptionRepository";
import { MongoSubscriptionRepository } from "../../../infrastructure/databases/repositories/subscriptionRepository";
import { MongoRevenueRepository } from "../../../infrastructure/databases/repositories/revenueRepository";
import { MongoConversationRepository } from "../../../infrastructure/databases/repositories/conversationRepository";
import { StripePaymentService } from "../../../infrastructure/services/payments/stripeServices";
import { PurchaseSubscriptionUseCase } from "../../../application/usecases/subscription/purchaseSubscriptionUseCase";
import { WebHookHandlerUseCase } from "../../../application/usecases/subscription/webhookHandlerUseCase";
import { EmailService } from "../../../infrastructure/services/communication/emailService";
import { MongoUserRepository } from "../../../infrastructure/databases/repositories/userRepository";

//MONGO REPOSITORY INSTANCES
const mongoSubscriptionRepository = new MongoSubscriptionRepository();
const monogUserSubscriptionPlanRepository =
  new MongoUserSubscriptionPlanRepository();
const mongoRevenueRepository = new MongoRevenueRepository();
const mongoConversationRepository = new MongoConversationRepository();
const mongoUserRepository = new MongoUserRepository();
//SERVICE INSTANCES
const stripeService = new StripePaymentService();
const emailService = new EmailService();

//USE CASE INSTANCES
const purchaseSubscriptionUseCase = new PurchaseSubscriptionUseCase(
  mongoSubscriptionRepository,
  monogUserSubscriptionPlanRepository,
  stripeService
);

const webHookHandlerUseCase = new WebHookHandlerUseCase(
  mongoSubscriptionRepository,
  monogUserSubscriptionPlanRepository,
  mongoRevenueRepository,
  mongoConversationRepository,
  stripeService,
  emailService,
  mongoUserRepository
);

export class WebhookController {
  static async webHookHandler(req: Request, res: Response): Promise<void> {
    const sig = req.headers["stripe-signature"];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRETKEY;
    await webHookHandlerUseCase.webHookHandler(
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

  static async getSubscriptionBySession(
    req: Request,
    res: Response
  ): Promise<void> {
    const { sessionId } = req.params;
    const subscriptionData =
      await purchaseSubscriptionUseCase.getSubscriptionBySession(sessionId);
    sendResponse(
      res,
      HttpStatusCodes.OK,
      { subscriptionData: subscriptionData },
      SubscriptionStatus.SubscriptionAddedSuccessfully
    );
  }
}
