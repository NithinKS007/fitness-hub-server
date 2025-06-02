import { validationError } from "../../../presentation/middlewares/error.middleware";
import {
  ApplicationStatus,
  AuthStatus,
  SubscriptionStatus,
} from "../../../shared/constants/index.constants";
import { Subscription } from "../../../domain/entities/subscription.entities";
import { ISubscriptionRepository } from "../../../domain/interfaces/ISubscriptionRepository";
import { IPaymentService } from "../../interfaces/payments/IPayment.service";

export class DeleteSubscriptionUseCase {
  constructor(
    private subscriptionRepository: ISubscriptionRepository,
    private paymentService: IPaymentService
  ) {}

  async deleteSubscription(subscriptionId: string): Promise<Subscription> {
    if (!subscriptionId) {
      throw new validationError(ApplicationStatus.AllFieldsAreRequired);
    }
    const subscriptionData =
      await this.subscriptionRepository.findSubscriptionById(subscriptionId);

    if (!subscriptionData) {
      throw new validationError(AuthStatus.InvalidId);
    }
    const stripePriceId = subscriptionData.stripePriceId;
    if (stripePriceId) {
      await this.paymentService.deactivatePrice({ priceId: stripePriceId });
    }
    const deletedSubscription =
      await this.subscriptionRepository.deletedSubscription(subscriptionId);

    if (!deletedSubscription) {
      throw new validationError(SubscriptionStatus.FailedToDeleteSubscription);
    }
    return deletedSubscription;
  }
}
