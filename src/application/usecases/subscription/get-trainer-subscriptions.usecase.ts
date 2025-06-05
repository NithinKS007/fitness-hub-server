import { validationError } from "../../../presentation/middlewares/error.middleware";
import { AuthStatus } from "../../../shared/constants/index.constants";
import { Subscription } from "../../../domain/entities/subscription.entities";
import { ISubscriptionRepository } from "../../../domain/interfaces/ISubscriptionRepository";

export class GetTrainerSubscriptionsUseCase {
  constructor(private subscriptionRepository: ISubscriptionRepository) {}
  async execute(trainerId: string): Promise<Subscription[]> {
    if (!trainerId) {
      throw new validationError(AuthStatus.IdRequired);
    }
    return await this.subscriptionRepository.findAllSubscription(trainerId);
  }
}
