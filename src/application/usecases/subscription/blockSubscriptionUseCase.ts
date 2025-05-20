import { UpdateSubscriptionBlockStatusDTO } from "../../dtos/subscription-dtos";
import { validationError } from "../../../presentation/middlewares/errorMiddleWare";
import {
  AuthStatus,
  BlockStatus,
} from "../../../shared/constants/index-constants";
import { Subscription } from "../../../domain/entities/subscription";
import { ISubscriptionRepository } from "../../../domain/interfaces/ISubscriptionRepository";

export class SubscriptionBlockUseCase {
  constructor(private subscriptionRepository: ISubscriptionRepository) {}

  public async updateSubscriptionBlockStatus({
    subscriptionId,
    isBlocked,
  }: UpdateSubscriptionBlockStatusDTO): Promise<Subscription> {
    if (!subscriptionId || typeof isBlocked !== "boolean") {
      throw new validationError(
        AuthStatus.AllFieldsAreRequired
      );
    }

    const subscriptionData =
      await this.subscriptionRepository.findSubscriptionById(subscriptionId);

    if (!subscriptionData) {
      throw new validationError(AuthStatus.InvalidId);
    }

    const updatedSubscriptionData =
      await this.subscriptionRepository.updateBlockStatus({
        subscriptionId,
        isBlocked,
      });

    if (!updatedSubscriptionData) {
      throw new validationError(BlockStatus.FailedToUpdateBlockStatus);
    }

    return updatedSubscriptionData;
  }
}
