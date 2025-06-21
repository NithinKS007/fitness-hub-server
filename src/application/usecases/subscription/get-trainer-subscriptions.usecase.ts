import { validationError } from "@presentation/middlewares/error.middleware";
import { AuthStatus } from "@shared/constants/index.constants";
import { ISubscriptionRepository } from "@domain/interfaces/ISubscriptionRepository";
import { ISubscription } from "@domain/entities/subscription.entity";
import { injectable, inject } from "inversify";
import { TYPES_REPOSITORIES } from "@di/types-repositories";

@injectable()
export class GetTrainerSubscriptionsUseCase {
  constructor(
    @inject(TYPES_REPOSITORIES.SubscriptionRepository)
    private subscriptionRepository: ISubscriptionRepository
  ) {}
  async execute(trainerId: string): Promise<ISubscription[]> {
    if (!trainerId) {
      throw new validationError(AuthStatus.IdRequired);
    }
    return await this.subscriptionRepository.findAllSubscription(trainerId);
  }
}
