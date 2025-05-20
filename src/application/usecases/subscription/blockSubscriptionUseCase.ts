import { UpdateSubscriptionBlockStatusDTO } from "../../dtos/subscription-dtos";
import { validationError } from "../../../presentation/middlewares/errorMiddleWare";
import {
  AuthenticationStatusMessage,
  BlockStatusMessage,
} from "../../../shared/constants/httpResponseStructure";
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
        AuthenticationStatusMessage.AllFieldsAreRequired
      );
    }

    const subscriptionData =
      await this.subscriptionRepository.findSubscriptionById(subscriptionId);

    if (!subscriptionData) {
      throw new validationError(AuthenticationStatusMessage.InvalidId);
    }

    const updatedSubscriptionData =
      await this.subscriptionRepository.updateBlockStatus({
        subscriptionId,
        isBlocked,
      });

    if (!updatedSubscriptionData) {
      throw new validationError(BlockStatusMessage.FailedToUpdateBlockStatus);
    }

    return updatedSubscriptionData;
  }
}
