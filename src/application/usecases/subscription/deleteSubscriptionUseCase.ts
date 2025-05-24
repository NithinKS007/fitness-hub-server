import { validationError } from "../../../presentation/middlewares/errorMiddleWare";
import {
  AuthStatus,
  SubscriptionStatus,
} from "../../../shared/constants/index-constants";
import { Subscription } from "../../../domain/entities/subscription";
import { ISubscriptionRepository } from "../../../domain/interfaces/ISubscriptionRepository";
import { IPaymentService } from "../../interfaces/payments/IPaymentService";
import { IdDTO } from "../../dtos/utility-dtos";

export class DeleteSubscriptionUseCase {
  constructor(
    private subscriptionRepository: ISubscriptionRepository,
    private paymentService: IPaymentService
  ) {}

  public async deleteSubscription(
    subscriptionId: IdDTO
  ): Promise<Subscription> {
    if (!subscriptionId) {
      throw new validationError(
        AuthStatus.AllFieldsAreRequired
      );
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
      throw new validationError(
        SubscriptionStatus.FailedToDeleteSubscription
      );
    }
    return deletedSubscription;
  }
}
