import { CheckSubscriptionStatusDTO } from "../../dtos/subscription-dtos";
import { validationError } from "../../../presentation/middlewares/errorMiddleWare";
import { AuthStatus } from "../../../shared/constants/index-constants";
import { IUserSubscriptionPlanRepository } from "../../../domain/interfaces/IUserSubscriptionRepository";
import { IPaymentService } from "../../interfaces/payments/IPaymentService";

export class CheckSubscriptionStatusUseCase {
  constructor(
    private userSubscriptionPlanRepository: IUserSubscriptionPlanRepository,
    private paymentService: IPaymentService
  ) {}

  public async isUserSubscribedToTheTrainer({
    userId,
    trainerId,
  }: CheckSubscriptionStatusDTO): Promise<{
    trainerId: string;
    isSubscribed: boolean;
  }> {
    if (!userId || !trainerId) {
      throw new validationError(
        AuthStatus.AllFieldsAreRequired
      );
    }

    const subscriptionData =
      await this.userSubscriptionPlanRepository.findSubscriptionsOfUserwithUserIdAndTrainerId(
        { userId, trainerId }
      );
    if (subscriptionData && subscriptionData.length > 0) {
      for (const sub of subscriptionData) {
        try {
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
        } catch (error) {
          console.log(
            `Error checking subscription ${sub.stripeSubscriptionId}:`,
            error
          );
        }
      }
    }
    return {
      trainerId: trainerId,
      isSubscribed: false,
    };
  }
}
