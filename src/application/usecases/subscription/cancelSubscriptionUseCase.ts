import { CancelSubscriptionDTO } from "../../dtos/subscription-dtos";
import { validationError } from "../../../presentation/middlewares/errorMiddleWare";
import { AuthStatus } from "../../../shared/constants/index-constants";
import { IPaymentService } from "../../interfaces/payments/IPaymentService";

export class CancelSubscriptionUseCase {
  constructor(private paymentService: IPaymentService) {}

  public async cancelSubscription({
    stripeSubscriptionId,
    action,
  }: CancelSubscriptionDTO): Promise<{
    stripeSubscriptionId: string;
    isActive: string;
    cancelAction: string;
  }> {
    if (!stripeSubscriptionId || !action) {
      throw new validationError(
        AuthStatus.AllFieldsAreRequired
      );
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
