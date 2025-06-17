import { validationError } from "@presentation/middlewares/error.middleware";
import {
  ApplicationStatus,
  AuthStatus,
  SubscriptionStatus,
} from "@shared/constants/index.constants";
import { ISubscriptionRepository } from "@domain/interfaces/ISubscriptionRepository";
import { IPaymentService } from "@application/interfaces/payments/IPayment.service";
import { ISubscription } from "@domain/entities/subscription.entity";

export class DeleteSubscriptionUseCase {
  constructor(
    private subscriptionRepository: ISubscriptionRepository,
    private paymentService: IPaymentService
  ) {}

  async execute(subscriptionId: string): Promise<ISubscription> {
    if (!subscriptionId) {
      throw new validationError(ApplicationStatus.AllFieldsAreRequired);
    }
    const subscriptionData = await this.subscriptionRepository.findById(
      subscriptionId
    );

    if (!subscriptionData) {
      throw new validationError(AuthStatus.InvalidId);
    }
    const stripePriceId = subscriptionData.stripePriceId;
    if (stripePriceId) {
      await this.paymentService.deactivatePrice({ priceId: stripePriceId });
    }
    const deletedSubscription = await this.subscriptionRepository.delete(
      subscriptionId
    );

    if (!deletedSubscription) {
      throw new validationError(SubscriptionStatus.FailedToDeleteSubscription);
    }
    return deletedSubscription;
  }
}
