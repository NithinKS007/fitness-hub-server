import { validationError } from "@presentation/middlewares/error.middleware";
import {
  ApplicationStatus,
  SubscriptionStatus,
} from "@shared/constants/index.constants";
import { IUserSubscriptionPlanRepository } from "@domain/interfaces/IUserSubscriptionPlanRepository";
import { UserSubscriptionPlan } from "@domain/entities/subscription-plan.entity";
import { IPaymentService } from "@application/interfaces/services/payments/IPayment.service";
import { injectable, inject } from "inversify";
import { TYPES_SERVICES } from "@di/types-services";
import { TYPES_REPOSITORIES } from "@di/types-repositories";
import { IVerifySubscriptionSessionUC } from "@application/interfaces/usecases/ISubscriptionUC";

@injectable()
export class VerifySubcriptionSessionUseCase
  implements IVerifySubscriptionSessionUC
{
  constructor(
    @inject(TYPES_REPOSITORIES.UserSubscriptionPlanRepository)
    private userSubscriptionPlanRepository: IUserSubscriptionPlanRepository,
    @inject(TYPES_SERVICES.PaymentService)
    private paymentService: IPaymentService
  ) {}

  async execute(
    sessionId: string
  ): Promise<UserSubscriptionPlan & { isSubscribed: boolean }> {
    if (!sessionId) {
      throw new validationError(ApplicationStatus.AllFieldsAreRequired);
    }
    const session = await this.paymentService.getCheckoutSession(sessionId);
    if (!session) {
      throw new validationError(SubscriptionStatus.InvalidSessionIdForStripe);
    }
    const stripeSubscriptionId =
      typeof session.subscription === "string"
        ? session.subscription
        : session.subscription?.id;

    if (!stripeSubscriptionId) {
      throw new validationError("Failed");
    }
    const userTakenSubscription =
      await this.userSubscriptionPlanRepository.getSubscriptionByStripeId(
        stripeSubscriptionId
      );

    if (!userTakenSubscription) {
      throw new validationError(SubscriptionStatus.NotFound);
    }
    const stripeSubscription = await this.paymentService.getSubscription(
      stripeSubscriptionId
    );
    const subscriptionStatus =
      stripeSubscription.status === "active" &&
      userTakenSubscription.stripeSubscriptionStatus === "active";

    return {
      ...userTakenSubscription,
      isSubscribed: subscriptionStatus,
    };
  }
}
