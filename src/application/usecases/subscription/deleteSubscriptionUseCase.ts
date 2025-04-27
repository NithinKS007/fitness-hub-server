import { validationError } from "../../../presentation/middlewares/errorMiddleWare";
import {
  AuthenticationStatusMessage,
  SubscriptionStatusMessage,
} from "../../../shared/constants/httpResponseStructure";
import { Subscription } from "../../../domain/entities/subscription";
import { ISubscriptionRepository } from "../../../domain/interfaces/ISubscriptionRepository";
import { IPaymentService } from "../../interfaces/payments/IPaymentService";
import { IdDTO } from "../../dtos/utilityDTOs";

export class DeleteSubscription {
  constructor(
    private subscriptionRepository: ISubscriptionRepository,
    private paymentService: IPaymentService
  ) {}

  public async deleteSubscription(
    subscriptionId: IdDTO
  ): Promise<Subscription> {
    if (!subscriptionId) {
      throw new validationError(
        AuthenticationStatusMessage.AllFieldsAreRequired
      );
    }
    const subscriptionData =
      await this.subscriptionRepository.findSubscriptionById(subscriptionId);

    if (!subscriptionData) {
      throw new validationError(AuthenticationStatusMessage.InvalidId);
    }
    const stripePriceId = subscriptionData.stripePriceId;
    if (stripePriceId) {
      await this.paymentService.deactivatePrice({ priceId: stripePriceId });
    }
    const deletedSubscription =
      await this.subscriptionRepository.deletedSubscription(subscriptionId);

    if (!deletedSubscription) {
      throw new validationError(
        SubscriptionStatusMessage.FailedToDeleteSubscription
      );
    }
    return deletedSubscription;
  }
}
