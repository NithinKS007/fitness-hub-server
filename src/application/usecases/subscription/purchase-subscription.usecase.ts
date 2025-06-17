import { PurchaseSubscriptionDTO } from "@application/dtos/subscription-dtos";
import { validationError } from "@presentation/middlewares/error.middleware";
import { SubscriptionStatus } from "@shared/constants/index.constants";
import { ISubscriptionRepository } from "@domain/interfaces/ISubscriptionRepository";
import { IPaymentService } from "@application/interfaces/payments/IPayment.service";

export class PurchaseSubscriptionUseCase {
  constructor(
    private subscriptionRepository: ISubscriptionRepository,
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
      throw new validationError(
        SubscriptionStatus.FailedToRetrieveSubscriptionDetails
      );
    }
    if (subscriptionData.isBlocked) {
      throw new validationError(
        SubscriptionStatus.SubscriptionBlockedUnavailabe
      );
    }
    const sessionId = await this.paymentService.createSubscriptionSession({
      stripePriceId: subscriptionData.stripePriceId,
      userId: userId,
      trainerId: subscriptionData.trainerId.toString(),
      subscriptionId: subscriptionData._id.toString(),
    });
    if (!sessionId) {
      throw new validationError(
        SubscriptionStatus.FailedToCreateSubscriptionSession
      );
    }
    return sessionId.sessionId;
  }
}
