import { validationError } from "@presentation/middlewares/error.middleware";
import {
  ApplicationStatus,
  AuthStatus,
  SubscriptionStatus,
} from "@shared/constants/index.constants";
import { ISubscriptionRepository } from "@domain/interfaces/ISubscriptionRepository";
import { IPaymentService } from "@application/interfaces/services/payments/IPayment.service";
import { Subscription } from "@domain/entities/subscription.entity";
import { injectable, inject } from "inversify";
import { TYPES_SERVICES } from "@di/types-services";
import { TYPES_REPOSITORIES } from "@di/types-repositories";
import { IDeleteSubscriptionUC } from "@application/interfaces/usecases/ISubscriptionPlanUC";

@injectable()
export class DeleteSubscriptionUseCase implements IDeleteSubscriptionUC {
  constructor(
    @inject(TYPES_REPOSITORIES.SubscriptionRepository)
    private subscriptionRepository: ISubscriptionRepository,
    @inject(TYPES_SERVICES.PaymentService)
    private paymentService: IPaymentService
  ) {}

  async execute(subscriptionId: string): Promise<Subscription> {
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
      throw new validationError(SubscriptionStatus.DeleteFailed);
    }
    return deletedSubscription;
  }
}
