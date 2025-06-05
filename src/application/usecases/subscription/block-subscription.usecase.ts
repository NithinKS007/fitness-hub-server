import { UpdateSubscriptionBlockStatusDTO } from "../../dtos/subscription-dtos";
import { validationError } from "../../../presentation/middlewares/error.middleware";
import {
  ApplicationStatus,
  AuthStatus,
  BlockStatus,
} from "../../../shared/constants/index.constants";
import { Subscription } from "../../../domain/entities/subscription.entities";
import { ISubscriptionRepository } from "../../../domain/interfaces/ISubscriptionRepository";

export class SubscriptionBlockUseCase {
  constructor(private subscriptionRepository: ISubscriptionRepository) {}
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
      throw new validationError(BlockStatus.FailedToUpdateBlockStatus);
    }
    return updatedSubscriptionData;
  }
}
