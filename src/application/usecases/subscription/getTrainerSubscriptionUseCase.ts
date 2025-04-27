import { validationError } from "../../../presentation/middlewares/errorMiddleWare";
import {
  AuthenticationStatusMessage,
  SubscriptionStatusMessage,
} from "../../../shared/constants/httpResponseStructure";
import { Subscription, TrainerSubscribersList } from "../../../domain/entities/subscription";
import { ISubscriptionRepository } from "../../../domain/interfaces/ISubscriptionRepository";
import { IUserSubscriptionPlanRepository } from "../../../domain/interfaces/IUserSubscriptionRepository";
import {
  GetTrainerSubscribersQueryDTO,
} from "../../dtos/queryDTOs";
import { IPaymentService } from "../../interfaces/payments/IPaymentService";
import { IdDTO, PaginationDTO } from "../../dtos/utilityDTOs";

export class GetTrainerSubscriptionUseCase {
  constructor(
    private subscriptionRepository: ISubscriptionRepository,
    private userSubscriptionPlanRepository: IUserSubscriptionPlanRepository,
    private paymentService: IPaymentService
  ) {}

  public async getTrainerSubscriptions(
    trainerId: IdDTO
  ): Promise<Subscription[]> {
    if (!trainerId) {
      throw new validationError(AuthenticationStatusMessage.IdRequired);
    }
    return await this.subscriptionRepository.findAllSubscription(trainerId);
  }

  public async getTrainerSubscribedUsers(
    trainerId: IdDTO,
    { page, limit, search, filters }: GetTrainerSubscribersQueryDTO
  ): Promise<{
    trainerSubscribers: TrainerSubscribersList[];
    paginationData: PaginationDTO;
  }> {
    if (!trainerId) {
      throw new validationError(
        AuthenticationStatusMessage.AllFieldsAreRequired
      );
    }
    const { trainerSubscriberRecord, paginationData } =
      await this.userSubscriptionPlanRepository.findSubscriptionsOfTrainer(
        trainerId,
        { page, limit, search, filters }
      );
    if (!trainerSubscriberRecord) {
      throw new validationError(
        SubscriptionStatusMessage.FailedToRetrieveSubscriptionDetails
      );
    }

    const trainerSubscribers = await Promise.all(
      trainerSubscriberRecord.map(async (sub) => {
        const stripeData = await this.paymentService.getSubscriptionsData(sub.stripeSubscriptionId);
        return {
          ...sub,
          ...stripeData,
        };
      })
    );

    return { trainerSubscribers: trainerSubscribers, paginationData };
  }
}
