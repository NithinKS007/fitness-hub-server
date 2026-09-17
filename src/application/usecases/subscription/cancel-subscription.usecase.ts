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
import { IPaymentService } from "@application/interfaces/services/payments/IPayment.service";
import { injectable, inject } from "inversify";
import { TYPES_SERVICES } from "@di/types-services";
import { ICancelSubscriptionUC } from "@application/interfaces/usecases/ISubscriptionUC";

@injectable()
export class CancelSubscriptionUseCase implements ICancelSubscriptionUC {
  constructor(
    @inject(TYPES_SERVICES.PaymentService)
    private paymentService: IPaymentService
  ) {}

  async execute({ providerSubId, action }: CancelSubscriptionDTO): Promise<{
    providerSubId: string;
    isActive: string;
    cancelAction: string;
  }> {
    if (!providerSubId || !action) {
      throw new validationError(ApplicationStatus.AllFieldsAreRequired);
    }
    const stripeSub = await this.paymentService.getSubscriptionById({
      providerSubId: providerSubId,
    });

    if (!stripeSub) {
      throw new validationError(AuthStatus.InvalidId);
    }
    if (action === CancelSubAction.immediately) {
      const stripeSub = await this.paymentService.cancelSubscription({
        providerSubId: providerSubId,
      });
      return {
        providerSubId: stripeSub.id,
        isActive: stripeSub.status,
        cancelAction: action,
      };
    } else {
      throw new validationError(SubscriptionStatus.CancelFailed);
    }
  }
}
