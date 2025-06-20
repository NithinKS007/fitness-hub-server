import {
  CancelSubAction,
  CancelSubscriptionDTO,
} from "@application/dtos/subscription-dtos";
import { validationError } from "@presentation/middlewares/error.middleware";
import {
  ApplicationStatus,
  AuthStatus,
  SubscriptionStatus,
} from "@shared/constants/index.constants";
import { IPaymentService } from "@application/interfaces/payments/IPayment.service";
import { injectable, inject } from "inversify";
import { TYPES_SERVICES } from "di/types-services";

@injectable()
export class CancelSubscriptionUseCase {
  constructor(
    @inject(TYPES_SERVICES.PaymentService)
    private paymentService: IPaymentService
  ) {}

  async execute({
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
    if (action === CancelSubAction.immediately) {
      const stripeSub = await this.paymentService.cancelSubscription(
        stripeSubscriptionId
      );
      return {
        stripeSubscriptionId: stripeSub.id,
        isActive: stripeSub.status,
        cancelAction: action,
      };
    } else {
      throw new validationError(SubscriptionStatus.CancelFailed);
    }
  }
}
