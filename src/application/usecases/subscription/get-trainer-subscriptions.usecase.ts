import { validationError } from "@presentation/middlewares/error.middleware";
import { AuthStatus } from "@shared/constants/index.constants";
import { ISubscriptionRepository } from "@domain/interfaces/ISubscriptionRepository";
import { Subscription } from "@domain/entities/subscription.entity";
import { injectable, inject } from "inversify";
import { TYPES_REPOSITORIES } from "@di/types-repositories";
import { IGetTrainerSubscriptionsUC } from "@application/interfaces/usecases/ISubscriptionUC";

@injectable()
export class GetTrainerSubscriptionsUseCase
  implements IGetTrainerSubscriptionsUC
{
  constructor(
    @inject(TYPES_REPOSITORIES.SubscriptionRepository)
    private subscriptionRepository: ISubscriptionRepository
  ) {}
  async execute(trainerId: string): Promise<Subscription[]> {
    if (!trainerId) {
      throw new validationError(AuthStatus.IdRequired);
    }
    return await this.subscriptionRepository.findAllSubscription(trainerId);
  }
}
