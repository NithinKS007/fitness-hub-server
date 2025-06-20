import { PurchaseSubscriptionDTO } from "@application/dtos/subscription-dtos";
import { validationError } from "@presentation/middlewares/error.middleware";
import { SubscriptionStatus } from "@shared/constants/index.constants";
import { ISubscriptionRepository } from "@domain/interfaces/ISubscriptionRepository";
import { IPaymentService } from "@application/interfaces/payments/IPayment.service";
import { injectable, inject } from "inversify";
import { TYPES_REPOSITORIES } from "di/types-repositories";
import { TYPES_SERVICES } from "di/types-services";

@injectable()
export class PurchaseSubscriptionUseCase {
  constructor(
    @inject(TYPES_REPOSITORIES.SubscriptionRepository)
    private subscriptionRepository: ISubscriptionRepository,
    @inject(TYPES_SERVICES.PaymentService)
    private paymentService: IPaymentService
  ) {}
  async execute({
    subscriptionId,
    userId,
  }: PurchaseSubscriptionDTO): Promise<string> {
    const subscriptionData = await this.subscriptionRepository.findById(
      subscriptionId
    );
    if (!subscriptionData) {
      throw new validationError(SubscriptionStatus.NotFound);
    }
    if (subscriptionData.isBlocked) {
      throw new validationError(SubscriptionStatus.Blocked);
    }
    const sessionId = await this.paymentService.createSubscriptionSession({
      stripePriceId: subscriptionData.stripePriceId,
      userId: userId,
      trainerId: subscriptionData.trainerId.toString(),
      subscriptionId: subscriptionData._id.toString(),
    });
    if (!sessionId) {
      throw new validationError(SubscriptionStatus.SessionCreateFailed);
    }
    return sessionId.sessionId;
  }
}
