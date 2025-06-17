import { CheckSubscriptionStatusDTO } from "@application/dtos/subscription-dtos";
import { validationError } from "@presentation/middlewares/error.middleware";
import { ApplicationStatus } from "@shared/constants/index.constants";
import { IUserSubscriptionPlanRepository } from "@domain/interfaces/IUserSubscriptionPlanRepository";
import { IPaymentService } from "@application/interfaces/payments/IPayment.service";

export class CheckSubscriptionStatusUseCase {
  constructor(
    private userSubscriptionPlanRepository: IUserSubscriptionPlanRepository,
    private paymentService: IPaymentService
  ) {}
  async execute({ userId, trainerId }: CheckSubscriptionStatusDTO): Promise<{
    trainerId: string;
    isSubscribed: boolean;
  }> {
    if (!userId || !trainerId) {
      throw new validationError(ApplicationStatus.AllFieldsAreRequired);
    }

    const subscriptionData =
      await this.userSubscriptionPlanRepository.getSubscriptionsByUserAndTrainerId(
        { userId, trainerId }
      );
    if (subscriptionData && subscriptionData.length > 0) {
      for (const sub of subscriptionData) {
        const stripeSubscription = await this.paymentService.getSubscription(
          sub.stripeSubscriptionId
        );
        if (
          stripeSubscription.status === "active" &&
          sub.stripeSubscriptionStatus === "active"
        ) {
          return {
            trainerId: trainerId,
            isSubscribed: true,
          };
        }
      }
    }
    return {
      trainerId: trainerId,
      isSubscribed: false,
    };
  }
}
