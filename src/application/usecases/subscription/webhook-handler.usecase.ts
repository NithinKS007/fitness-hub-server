import {
  NotFoundError,
  validationError,
} from "@presentation/middlewares/error.middleware";
import { SubscriptionStatus } from "@shared/constants/index.constants";
import { ISubscriptionRepository } from "@domain/interfaces/ISubscriptionRepository";
import { IUserSubscriptionPlanRepository } from "@domain/interfaces/IUserSubscriptionPlanRepository";
import { IFinancialLogRepository } from "@domain/interfaces/IFinancialLogRepository";
import { IChatRepository } from "@domain/interfaces/IChatRepository";
import { IPaymentService } from "@application/interfaces/services/payments/IPayment.service";
import { IEmailService } from "@application/interfaces/services/communication/IEmail.service";
import { IUserRepository } from "@domain/interfaces/IUserRepository";
import { UserSubscriptionPlan } from "@domain/entities/subscription-plan.entity";
import { injectable, inject } from "inversify";
import { TYPES_REPOSITORIES } from "@di/types-repositories";
import { TYPES_SERVICES } from "@di/types-services";
import { IWebHookHandlerUC } from "@application/interfaces/usecases/ISubscriptionUC";
import Stripe from "stripe";
import { Subscription } from "@domain/entities/subscription.entity";

@injectable()
export class WebHookHandlerUseCase implements IWebHookHandlerUC {
  constructor(
    @inject(TYPES_REPOSITORIES.SubscriptionRepository)
    private subscriptionRepository: ISubscriptionRepository,
    @inject(TYPES_REPOSITORIES.UserSubscriptionPlanRepository)
    private userSubscriptionPlanRepository: IUserSubscriptionPlanRepository,
    @inject(TYPES_REPOSITORIES.FinancialLogRepository)
    private revenueRepository: IFinancialLogRepository,
    @inject(TYPES_REPOSITORIES.ChatRepository)
    private chatRepository: IChatRepository,
    @inject(TYPES_SERVICES.PaymentService)
    private paymentService: IPaymentService,
    @inject(TYPES_SERVICES.EmailService)
    private emailService: IEmailService,
    @inject(TYPES_REPOSITORIES.UserRepository)
    private userRepository: IUserRepository
  ) {}
  private validateWebhookInput(
    sig: string,
    webhookSecret: string,
    body: string | Buffer
  ): void {
    if (!sig || !webhookSecret || !body) {
      throw new validationError(SubscriptionStatus.WebHookCredentialsMissing);
    }
  }

  private async sendSubscriptionConfirmationEmail(
    userId: string,
    trainerId: string
  ): Promise<void> {
    const userData = await this.userRepository.findById(userId);
    if (userData) {
      await this.emailService.sendEmail({
        to: userData?.email,
        subject: "Subscription Confirmation",
        text: `Your subscription with Trainer ID: ${trainerId} has been successfully activated.
             Enjoy your training sessions!`,
      });
    }
  }

  private async sendSubscriptionFailedEmail(
    userId: string,
    trainerId: string
  ): Promise<void> {
    const userData = await this.userRepository.findById(userId);

    if (userData) {
      await this.emailService.sendEmail({
        to: userData?.email,
        subject: "Payment Failed - Subscription Canceled",
        text: `Dear user, your payment for the subscription to Trainer ID:
            ${trainerId} has failed, and your subscription has been canceled. 
            Please update your payment method to continue the service.`,
      });
    }
  }

  private async SendSubscriptionCancelledEmail(
    userId: string,
    trainerId: string
  ): Promise<void> {
    const userData = await this.userRepository.findById(userId);
    if (userData) {
      await this.emailService.sendEmail({
        to: userData?.email,
        subject: "Subscription Cancelled",
        text: `Dear user, your subscription to Trainer ID: ${trainerId} has been canceled.
             We hope to have you back soon!`,
      });
    }
  }

  private async handleCheckoutSessionCompleted(
    event: Stripe.CheckoutSessionCompletedEvent
  ): Promise<void> {
    const session = event?.data?.object;

    if (!session || !session.client_reference_id || !session.metadata) {
      throw new validationError(SubscriptionStatus.NotFound);
    }

    const userId = session?.client_reference_id;
    const subscriptionId = session.metadata?.subscriptionId;
    const trainerId = session?.metadata?.trainerId;
    const providerSubId = session?.subscription;

    if (typeof providerSubId !== "string") {
      throw new validationError(SubscriptionStatus.InvalidSubProviderId);
    }

    const subscription = await this.paymentService.getSubscriptionById({
      providerSubId: providerSubId,
    });

    if (!subscription) {
      throw new validationError(SubscriptionStatus.NotFound);
    }

    if (!subscriptionId || !trainerId) {
      throw new validationError(
        SubscriptionStatus.SubscriptionIdAndTrainerIdMissing
      );
    }
    const subscriptionData = await this.subscriptionRepository.findById(
      subscriptionId
    );
    if (!subscriptionData) {
      throw new validationError(SubscriptionStatus.NotFound);
    }
    const newSubscriptionAdding = {
      userId: userId,
      trainerId: trainerId,
      subPeriod: subscriptionData?.subPeriod,
      price: subscriptionData?.price,
      durationInWeeks: subscriptionData?.durationInWeeks,
      sessionsPerWeek: subscriptionData?.sessionsPerWeek,
      totalSessions: subscriptionData?.totalSessions,
      providerPriceId: subscriptionData?.providerPriceId,
      providerSubId: providerSubId,
      providerSubStatus: subscription.status,
    };
    const createdSubscription = await this.userSubscriptionPlanRepository.create(
      newSubscriptionAdding
    );

    if (createdSubscription) {
      await Promise.all([
        this.sendSubscriptionConfirmationEmail(userId, trainerId),
        this.handleRevenue(subscriptionData, trainerId, createdSubscription),
        this.manageConversationStatus(createdSubscription, subscription.status),
      ]);
    }
    console.log(`Subscription ${subscriptionId} successful in webhook handler`);
  }

  private async handleRevenue(
    subscriptionData: Subscription,
    trainerId: string,
    createdSubscription: UserSubscriptionPlan
  ): Promise<void> {
    const adminCommission = Math.round(subscriptionData?.price * 0.1);
    const serviceFee = Math.round(subscriptionData?.price * 0.05);
    const trainerAmount = subscriptionData?.price - adminCommission - serviceFee;

    await this.revenueRepository.create({
      userId: createdSubscription.userId,
      trainerId: trainerId,
      subscriptionId: subscriptionData.id,
      userSubscriptionPlanId: createdSubscription.id,
      amountPaid: subscriptionData.price,
      serviceFee: serviceFee,
      trainerProfit: trainerAmount,
      commission: adminCommission,
    });
  }

  private async manageConversationStatus(
    createdSubscription: UserSubscriptionPlan,
    subscriptionStatus: string
  ): Promise<void> {
    const existingConversation = await this.chatRepository.findOne({
      userId: createdSubscription.userId,
      trainerId: createdSubscription.trainerId,
    });

    if (!existingConversation) {
      await this.chatRepository.create({
        userId: createdSubscription.userId,
        trainerId: createdSubscription.trainerId,
        providerSubStatus: subscriptionStatus,
      });
    } else {
      await this.chatRepository.update(existingConversation.id, {
        userId: createdSubscription.userId,
        trainerId: createdSubscription.trainerId,
        providerSubStatus: subscriptionStatus,
      });
    }
  }

  private async handleInvoicePaymentFailed(
    event: Stripe.InvoicePaymentFailedEvent
  ): Promise<void> {
    const invoice = event.data.object;
    const providerSubId = invoice.subscription;

    if (!providerSubId || typeof providerSubId !== "string") {
      throw new NotFoundError("Not found");
    }

    const userSubPlan = await this.userSubscriptionPlanRepository.findOne({
      providerSubId: providerSubId,
    });

    if (!userSubPlan) {
      throw new NotFoundError("sub not found");
    }

    const { userId, trainerId, id } = userSubPlan;

    const conversation = await this.chatRepository.findOne({
      userId,
      trainerId,
    });

    if (!conversation) {
      throw new NotFoundError("not found");
    }

    const { id: conversationId } = conversation;
    await this.chatRepository.update(conversationId, {
      providerSubStatus: "canceled",
    });

    await this.userSubscriptionPlanRepository.update(id, {
      providerSubId: providerSubId,
      providerSubStatus: "canceled",
    });

    await this.sendSubscriptionFailedEmail(userId, trainerId);
    console.log(`Subscription ${providerSubId} cancelled due to payment failure`);
  }

  private async handleSubscriptionDeleted(
    event: Stripe.CustomerSubscriptionDeletedEvent
  ): Promise<void> {
    const subscription = event.data.object;

    if (!subscription) {
      throw new NotFoundError("Not found");
    }

    const userSubPlan = await this.userSubscriptionPlanRepository.findOne({
      providerSubId: subscription.id,
    });

    if (!userSubPlan) {
      throw new NotFoundError("sub not found");
    }

    const { userId, trainerId, id } = userSubPlan;

    const conversation = await this.chatRepository.findOne({
      userId,
      trainerId,
    });

    if (!conversation) {
      throw new NotFoundError("not found");
    }

    const { id: conversationId } = conversation;
    await this.chatRepository.update(conversationId, {
      providerSubStatus: "canceled",
    });

    await this.userSubscriptionPlanRepository.update(id, {
      providerSubId: subscription.id,
      providerSubStatus: "canceled",
    });

    await this.SendSubscriptionCancelledEmail(userId, trainerId);
    console.log(
      `Subscription ${subscription.id} cancelled due to customer cancellation`
    );
  }

  async execute({
    sig,
    webhookSecret,
    body,
  }: {
    sig: string;
    webhookSecret: string;
    body: string | Buffer;
  }): Promise<void> {
    this.validateWebhookInput(sig, webhookSecret, body);
    const event = await this.paymentService.constructWebHookEvent(
      body,
      sig,
      webhookSecret
    );
    switch (event.type) {
      case "checkout.session.completed":
        await this.handleCheckoutSessionCompleted(event);
        break;
      case "invoice.payment_failed":
        await this.handleInvoicePaymentFailed(event);
        break;
      case "customer.subscription.deleted":
        await this.handleSubscriptionDeleted(event);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  }
}
