import { PurchaseSubscriptionDTO } from "../../dtos/subscription-dtos";
import { validationError } from "../../../presentation/middlewares/errorMiddleWare";
import {
  AuthStatus,
  SubscriptionStatus,
} from "../../../shared/constants/index-constants";
import { ISubscriptionRepository } from "../../../domain/interfaces/ISubscriptionRepository";
import { IUserSubscriptionPlanRepository } from "../../../domain/interfaces/IUserSubscriptionRepository";
import { SubscriptionPlanEntity } from "../../../domain/entities/SubscriptionPlan";
import { IPaymentService } from "../../interfaces/payments/IPaymentService";

export class PurchaseSubscriptionUseCase {
  constructor(
    private subscriptionRepository: ISubscriptionRepository,
    private userSubscriptionPlanRepository: IUserSubscriptionPlanRepository,
    private paymentService: IPaymentService
  ) {}
  public async createStripeSession({
    subscriptionId,
    userId,
  }: PurchaseSubscriptionDTO): Promise<string> {
    const subscriptionData =
      await this.subscriptionRepository.findSubscriptionById(subscriptionId);
    if (!subscriptionData) {
      throw new validationError(
        SubscriptionStatus.FailedToRetrieveSubscriptionDetails
      );
    }

    if (subscriptionData.isBlocked) {
      throw new validationError(
        SubscriptionStatus.SubscriptionBlockedUnavailabe
      );
    }
    const sessionId = await this.paymentService.createSubscriptionSession({
      stripePriceId: subscriptionData.stripePriceId,
      userId: userId,
      trainerId: subscriptionData.trainerId.toString(),
      subscriptionId: subscriptionData._id.toString(),
    });
    if (!sessionId) {
      throw new validationError(
        SubscriptionStatus.FailedToCreateSubscriptionSession
      );
    }
    return sessionId.sessionId;
  }

  public async getSubscriptionBySession(
    sessionId: string
  ): Promise<SubscriptionPlanEntity & { isSubscribed: boolean }> {
    if (!sessionId) {
      throw new validationError(
        AuthStatus.AllFieldsAreRequired
      );
    }
    const session = await this.paymentService.getCheckoutSession(sessionId);
    if (!session) {
      throw new validationError(
        SubscriptionStatus.InvalidSessionIdForStripe
      );
    }
    const stripeSubscriptionId =
      typeof session.subscription === "string"
        ? session.subscription
        : session.subscription?.id;

    console.log("stripe id",stripeSubscriptionId)
    const userTakenSubscription =
      await this.userSubscriptionPlanRepository.findSubscriptionByStripeSubscriptionId(
        stripeSubscriptionId as string
      );

    if (!userTakenSubscription) {
      throw new validationError(
        SubscriptionStatus.FailedToRetrieveSubscriptionDetails
      );
    }
    const stripeSubscription = await this.paymentService.getSubscription(
      stripeSubscriptionId as string
    );
    const subscriptionStatus =
      stripeSubscription.status === "active" &&
      userTakenSubscription.stripeSubscriptionStatus === "active";

    return { ...userTakenSubscription, isSubscribed: subscriptionStatus };
  }
}
