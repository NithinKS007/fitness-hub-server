import { validationError } from "../../../presentation/middlewares/errorMiddleWare";
import {
  SubscriptionStatusMessage,
} from "../../../shared/constants/httpResponseStructure";
import { ISubscriptionRepository } from "../../../domain/interfaces/ISubscriptionRepository";
import { IUserSubscriptionPlanRepository } from "../../../domain/interfaces/IUserSubscriptionRepository";
import stripe from "../../../infrastructure/config/stripeConfig";
import { IRevenueRepository } from "../../../domain/interfaces/IRevenueRepository";
import { IConversationRepository } from "../../../domain/interfaces/IConversationRepository";
import { IPaymentService } from "../../interfaces/payments/IPaymentService";

export class WebHookHandlerUseCase {
  constructor(
    private subscriptionRepository: ISubscriptionRepository,
    private userSubscriptionPlanRepository: IUserSubscriptionPlanRepository,
    private revenueRepository: IRevenueRepository,
    private conversationRepository: IConversationRepository,
    private paymentService: IPaymentService
  ) {}
  private validateWebhookInput(sig: any, webhookSecret: any, body: any): void {
    if (!sig || !webhookSecret || !body) {
      throw new validationError(
        SubscriptionStatusMessage.WebHookCredentialsMissing
      );
    }
  }

  private constructStripeEvent(body: any, sig: any, webhookSecret: any) {
    const event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    if (!event) {
      throw new validationError(
        SubscriptionStatusMessage.WebHookVerificationFailed
      );
    }
    return event;
  }

  public async webHookHandler(
    sig: string,
    webhookSecret: string,
    body: any
  ): Promise<void> {
    this.validateWebhookInput(sig, webhookSecret, body);
    const event = this.constructStripeEvent(body, sig, webhookSecret);
    switch (event.type) {
      case "checkout.session.completed":
        const session = event?.data?.object;
        const userId = session?.client_reference_id;
        if (session?.metadata) {
          const subscriptionId = session.metadata?.subscriptionId;
          const trainerId = session?.metadata?.trainerId;
          const stripeSubscriptionId = session?.subscription as string;
          const subscription = await this.paymentService.getSubscription(
            stripeSubscriptionId
          );

          if (!subscriptionId || !trainerId) {
            throw new validationError(
              SubscriptionStatusMessage.SubscriptionIdAndTraineIdMissing
            );
          }
          const subscriptionData =
            await this.subscriptionRepository.findSubscriptionById(
              subscriptionId
            );
          if (!subscriptionData) {
            throw new validationError(
              SubscriptionStatusMessage.FailedToRetrieveSubscriptionDetails
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
            await this.userSubscriptionPlanRepository.create(
              newSubscriptionAdding
            );

          if (createdSubscription) {
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

            const existingConversation =
              await this.conversationRepository.findConversation({
                userId: createdSubscription.userId.toString(),
                trainerId: trainerId,
              });

            if (!existingConversation) {
              await this.conversationRepository.createChatConversation({
                userId: createdSubscription.userId.toString(),
                trainerId: trainerId,
                stripeSubscriptionStatus: subscription.status,
              });
            } else {
              await this.conversationRepository.updateSubscriptionStatus({
                userId: createdSubscription.userId.toString(),
                trainerId: trainerId,
                stripeSubscriptionStatus: subscription.status,
              });
            }
          }
          console.log(
            `Subscription ${subscriptionId} successful in webhook handler`
          );
        }

        break;
      case "invoice.payment_failed":
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
          console.log(
            `Subscription ${stripeSubscriptionId} cancelled due to payment failure`
          );
        }

        break;
      case "customer.subscription.deleted":
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
          console.log(
            `Subscription ${subscription.id} cancelled due to customer cancellation`
          );
        }

        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  }
}
