import { validationError } from "../../../presentation/middlewares/error.middleware";
import { SubscriptionStatus } from "../../../shared/constants/index.constants";
import { ISubscriptionRepository } from "../../../domain/interfaces/ISubscriptionRepository";
import { IUserSubscriptionPlanRepository } from "../../../domain/interfaces/IUserSubscriptionRepository";
import stripe from "../../../infrastructure/config/stripe.config";
import { IPlatformEarningsRepository } from "../../../domain/interfaces/IPlatformEarningsRepository";
import { IConversationRepository } from "../../../domain/interfaces/IConversationRepository";
import { IPaymentService } from "../../interfaces/payments/IPayment.service";
import { IEmailService } from "../../interfaces/communication/IEmail.service";
import { IUserRepository } from "../../../domain/interfaces/IUserRepository";

export class WebHookHandlerUseCase {
  constructor(
    private subscriptionRepository: ISubscriptionRepository,
    private userSubscriptionPlanRepository: IUserSubscriptionPlanRepository,
    private revenueRepository: IPlatformEarningsRepository,
    private conversationRepository: IConversationRepository,
    private paymentService: IPaymentService,
    private emailService: IEmailService,
    private userRepository: IUserRepository
  ) {}
  private validateWebhookInput(sig: any, webhookSecret: any, body: any): void {
    if (!sig || !webhookSecret || !body) {
      throw new validationError(SubscriptionStatus.WebHookCredentialsMissing);
    }
  }

  private async sendSubscriptionConfirmationEmail(
    userId: string,
    trainerId: string
  ): Promise<void> {
    const userData = await this.userRepository.findById(userId);
    await this.emailService.sendEmail({
      to: userData?.email as string,
      subject: "Subscription Confirmation",
      text: `Your subscription with Trainer ID: ${trainerId} has been successfully activated.
             Enjoy your training sessions!`,
    });
  }

  private async sendSubscriptionFailedEmail(
    userId: string,
    trainerId: string
  ): Promise<void> {
    const userData = await this.userRepository.findById(userId);
    await this.emailService.sendEmail({
      to: userData?.email as string,
      subject: "Payment Failed - Subscription Canceled",
      text: `Dear user, your payment for the subscription to Trainer ID:
            ${trainerId} has failed, and your subscription has been canceled. 
            Please update your payment method to continue the service.`,
    });
  }

  private async SendSubscriptionCancelledEmail(
    userId: string,
    trainerId: string
  ): Promise<void> {
    const userData = await this.userRepository.findById(userId);
    await this.emailService.sendEmail({
      to: userData?.email as string,
      subject: "Subscription Cancelled",
      text: `Dear user, your subscription to Trainer ID: ${trainerId} has been canceled.
             We hope to have you back soon!`,
    });
  }

  private constructStripeEvent(body: any, sig: any, webhookSecret: any) {
    const event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    if (!event) {
      throw new validationError(SubscriptionStatus.WebHookVerificationFailed);
    }
    return event;
  }

  private async handleCheckoutSessionCompleted(event: any): Promise<void> {
    const session = event?.data?.object;
    const userId = session?.client_reference_id;
    if (session?.metadata) {
      const subscriptionId = session.metadata?.subscriptionId;
      const trainerId = session?.metadata?.trainerId;
      const stripeSubscriptionId = session?.subscription as string;
      const subscription = await this.paymentService.getSubscription(
        stripeSubscriptionId
      );

      if (!subscription) {
        throw new validationError(
          SubscriptionStatus.FailedToRetrieveSubscriptionDetails
        );
      }

      if (!subscriptionId || !trainerId) {
        throw new validationError(
          SubscriptionStatus.SubscriptionIdAndTraineIdMissing
        );
      }
      const subscriptionData =
        await this.subscriptionRepository.findSubscriptionById(subscriptionId);
      if (!subscriptionData) {
        throw new validationError(
          SubscriptionStatus.FailedToRetrieveSubscriptionDetails
        );
      }
      const newSubscriptionAdding = {
        userId: userId as string,
        trainerId: trainerId,
        subPeriod: subscriptionData?.subPeriod,
        price: subscriptionData?.price,
        durationInWeeks: subscriptionData?.durationInWeeks,
        sessionsPerWeek: subscriptionData?.sessionsPerWeek,
        totalSessions: subscriptionData?.totalSessions,
        stripePriceId: subscriptionData?.stripePriceId,
        stripeSubscriptionId: stripeSubscriptionId as string,
        stripeSubscriptionStatus: subscription.status,
      };
      const createdSubscription =
        await this.userSubscriptionPlanRepository.create(newSubscriptionAdding);

      if (createdSubscription) {
        await this.sendSubscriptionConfirmationEmail(
          userId as string,
          trainerId
        );
        await this.handleRevenue(
          subscriptionData,
          trainerId,
          createdSubscription
        );
        await this.manageConversationStatus(
          createdSubscription,
          trainerId,
          subscription.status
        );
      }
      console.log(
        `Subscription ${subscriptionId} successful in webhook handler`
      );
    }
  }

  private async handleRevenue(
    subscriptionData: any,
    trainerId: string,
    createdSubscription: any
  ): Promise<void> {
    const adminCommission = Math.round(subscriptionData?.price * 0.1);
    const platformFee = Math.round(subscriptionData?.price * 0.05);
    const trainerAmount =
      subscriptionData?.price - adminCommission - platformFee;

    await this.revenueRepository.create({
      userId: createdSubscription.userId.toString(),
      trainerId: trainerId,
      subscriptionId: subscriptionData._id.toString(),
      userSubscriptionPlanId: createdSubscription._id.toString(),
      amountPaid: subscriptionData.price,
      platformRevenue: platformFee,
      trainerRevenue: trainerAmount,
      commission: adminCommission,
    });
  }

  private async manageConversationStatus(
    createdSubscription: any,
    trainerId: string,
    subscriptionStatus: string
  ): Promise<void> {
    const existingConversation =
      await this.conversationRepository.findConversation({
        userId: createdSubscription.userId.toString(),
        trainerId: trainerId,
      });

    if (!existingConversation) {
      await this.conversationRepository.createChatConversation({
        userId: createdSubscription.userId.toString(),
        trainerId: trainerId,
        stripeSubscriptionStatus: subscriptionStatus,
      });
    } else {
      await this.conversationRepository.updateSubscriptionStatus({
        userId: createdSubscription.userId.toString(),
        trainerId: trainerId,
        stripeSubscriptionStatus: subscriptionStatus,
      });
    }
  }

  private async handleInvoicePaymentFailed(event: any): Promise<void> {
    const invoice = event.data.object;
    const stripeSubscriptionId = invoice.subscription as string;

    if (stripeSubscriptionId) {
      const findExistingSubscription =
        await this.userSubscriptionPlanRepository.findSubscriptionByStripeSubscriptionId(
          stripeSubscriptionId
        );
      const { userId, trainerId } = findExistingSubscription;
      if (findExistingSubscription) {
        await this.conversationRepository.updateSubscriptionStatus({
          userId: userId.toString(),
          trainerId: trainerId.toString(),
          stripeSubscriptionStatus: "canceled",
        });
      }
      await this.userSubscriptionPlanRepository.findSubscriptionByStripeSubscriptionIdAndUpdateStatus(
        { stripeSubscriptionId, status: "canceled" }
      );

      await this.sendSubscriptionFailedEmail(
        userId as string,
        trainerId.toString()
      );
      console.log(
        `Subscription ${stripeSubscriptionId} cancelled due to payment failure`
      );
    }
  }

  private async handleSubscriptionDeleted(event: any): Promise<void> {
    const subscription = event.data.object;

    if (subscription) {
      const findExistingSubscription =
        await this.userSubscriptionPlanRepository.findSubscriptionByStripeSubscriptionId(
          subscription.id
        );
      const { userId, trainerId } = findExistingSubscription;
      if (findExistingSubscription) {
        await this.conversationRepository.updateSubscriptionStatus({
          userId: userId.toString(),
          trainerId: trainerId.toString(),
          stripeSubscriptionStatus: "canceled",
        });
      }
      await this.userSubscriptionPlanRepository.findSubscriptionByStripeSubscriptionIdAndUpdateStatus(
        { stripeSubscriptionId: subscription.id, status: "canceled" }
      );
      await this.SendSubscriptionCancelledEmail(
        userId as string,
        trainerId.toString()
      );
      console.log(
        `Subscription ${subscription.id} cancelled due to customer cancellation`
      );
    }
  }

  async webHookHandler(
    sig: string,
    webhookSecret: string,
    body: any
  ): Promise<void> {
    this.validateWebhookInput(sig, webhookSecret, body);
    const event = this.constructStripeEvent(body, sig, webhookSecret);
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
