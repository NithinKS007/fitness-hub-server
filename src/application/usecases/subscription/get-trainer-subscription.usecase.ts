import { validationError } from "../../../presentation/middlewares/error.middleware";
import {
  ApplicationStatus,
  AuthStatus,
  SubscriptionStatus,
} from "../../../shared/constants/index.constants";
import {
  Subscription,
  TrainerSubscribersList,
} from "../../../domain/entities/subscription.entities";
import { ISubscriptionRepository } from "../../../domain/interfaces/ISubscriptionRepository";
import { IUserSubscriptionPlanRepository } from "../../../domain/interfaces/IUserSubscriptionRepository";
import { GetTrainerSubscribersQueryDTO } from "../../dtos/query-dtos";
import { IPaymentService } from "../../interfaces/payments/IPayment.service";
import { PaginationDTO } from "../../dtos/utility-dtos";

export class GetTrainerSubscriptionUseCase {
  constructor(
    private subscriptionRepository: ISubscriptionRepository,
    private userSubscriptionPlanRepository: IUserSubscriptionPlanRepository,
    private paymentService: IPaymentService
  ) {}

  async getTrainerSubscriptions(trainerId: string): Promise<Subscription[]> {
    if (!trainerId) {
      throw new validationError(AuthStatus.IdRequired);
    }
    return await this.subscriptionRepository.findAllSubscription(trainerId);
  }

  async getTrainerSubscribedUsers(
    trainerId: string,
    { page, limit, search, filters }: GetTrainerSubscribersQueryDTO
  ): Promise<{
    trainerSubscribers: TrainerSubscribersList[];
    paginationData: PaginationDTO;
  }> {
    if (!trainerId) {
      throw new validationError(ApplicationStatus.AllFieldsAreRequired);
    }
    const query = { page, limit, search, filters };
    const { trainerSubscriberRecord, paginationData } =
      await this.userSubscriptionPlanRepository.findSubscriptionsOfTrainer(
        trainerId,
        query
      );
    if (!trainerSubscriberRecord) {
      throw new validationError(
        SubscriptionStatus.FailedToRetrieveSubscriptionDetails
      );
    }

    const trainerSubscribers = await Promise.all(
      trainerSubscriberRecord.map(async (sub) => {
        const stripeData = await this.paymentService.getSubscriptionsData(
          sub.stripeSubscriptionId
        );
        return {
          ...sub,
          ...stripeData,
        };
      })
    );

    return { trainerSubscribers: trainerSubscribers, paginationData };
  }
}
