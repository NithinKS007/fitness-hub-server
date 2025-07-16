import { UpdateSubscriptionBlockStatusDTO } from "@application/dtos/subscription-dtos";
import { validationError } from "@presentation/middlewares/error.middleware";
import {
  ApplicationStatus,
  AuthStatus,
  BlockStatus,
} from "@shared/constants/index.constants";
import { ISubscriptionRepository } from "@domain/interfaces/ISubscriptionRepository";
import { Subscription } from "@domain/entities/subscription.entity";
import { injectable, inject } from "inversify";
import { TYPES_REPOSITORIES } from "@di/types-repositories";
import { ISubscriptionBlockUC } from "@application/interfaces/usecases/ISubscriptionPlanUC";

@injectable()
export class SubscriptionBlockUseCase implements ISubscriptionBlockUC {
  constructor(
    @inject(TYPES_REPOSITORIES.SubscriptionRepository)
    private subscriptionRepository: ISubscriptionRepository
  ) {}

  async execute({
    subscriptionId,
    isBlocked,
  }: UpdateSubscriptionBlockStatusDTO): Promise<Subscription> {
    if (!subscriptionId || typeof isBlocked !== "boolean") {
      throw new validationError(ApplicationStatus.AllFieldsAreRequired);
    }
    const subscriptionData = await this.subscriptionRepository.findById(
      subscriptionId
    );
    if (!subscriptionData) {
      throw new validationError(AuthStatus.InvalidId);
    }
    const updatedSubscriptionData = await this.subscriptionRepository.update(
      subscriptionId,
      {
        isBlocked: isBlocked,
      }
    );
    if (!updatedSubscriptionData) {
      throw new validationError(BlockStatus.StatusUpdateFailed);
    }
    return updatedSubscriptionData;
  }
}
