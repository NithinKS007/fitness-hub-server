import { CheckSubscriptionStatusDTO } from "@application/dtos/subscription-dtos";
import { validationError } from "@presentation/middlewares/error.middleware";
import { ApplicationStatus } from "@shared/constants/index.constants";
import { IUserSubscriptionPlanRepository } from "@domain/interfaces/IUserSubscriptionPlanRepository";
import { IPaymentService } from "@application/interfaces/payments/IPayment.service";
import { injectable, inject } from "inversify";
import { TYPES_REPOSITORIES } from "@di/types-repositories";
import { TYPES_SERVICES } from "@di/types-services";

@injectable()
export class CheckSubscriptionStatusUseCase {
  constructor(
    @inject(TYPES_REPOSITORIES.UserSubscriptionPlanRepository)
    private userSubscriptionPlanRepository: IUserSubscriptionPlanRepository,
    @inject(TYPES_SERVICES.PaymentService)
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
