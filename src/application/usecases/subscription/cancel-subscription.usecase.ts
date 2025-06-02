import { CancelSubscriptionDTO } from "../../dtos/subscription-dtos";
import { validationError } from "../../../presentation/middlewares/error.middleware";
import {
  ApplicationStatus,
  AuthStatus,
} from "../../../shared/constants/index.constants";
import { IPaymentService } from "../../interfaces/payments/IPayment.service";

export class CancelSubscriptionUseCase {
  constructor(private paymentService: IPaymentService) {}
  async cancelSubscription({
    stripeSubscriptionId,
    action,
  }: CancelSubscriptionDTO): Promise<{
    stripeSubscriptionId: string;
    isActive: string;
    cancelAction: string;
  }> {
    if (!stripeSubscriptionId || !action) {
      throw new validationError(ApplicationStatus.AllFieldsAreRequired);
    }
    const stripeSub = await this.paymentService.getSubscription(
      stripeSubscriptionId
    );

    if (!stripeSub) {
      throw new validationError(AuthStatus.InvalidId);
    }
    if (action === "cancelImmediately") {
      const stripeSub = await this.paymentService.cancelSubscription(
        stripeSubscriptionId
      );
      return {
        stripeSubscriptionId: stripeSub.id,
        isActive: stripeSub.status,
        cancelAction: action,
      };
    } else {
      throw new validationError("Invalid cancellation action");
    }
  }
}
