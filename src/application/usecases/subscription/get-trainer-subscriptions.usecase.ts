import { validationError } from "@presentation/middlewares/error.middleware";
import { AuthStatus } from "@shared/constants/index.constants";
import { ISubscriptionRepository } from "@domain/interfaces/ISubscriptionRepository";
import { ISubscription } from "@domain/entities/subscription.entity";

export class GetTrainerSubscriptionsUseCase {
  constructor(private subscriptionRepository: ISubscriptionRepository) {}
  async execute(trainerId: string): Promise<ISubscription[]> {
    if (!trainerId) {
      throw new validationError(AuthStatus.IdRequired);
    }
    return await this.subscriptionRepository.findAllSubscription(trainerId);
  }
}
