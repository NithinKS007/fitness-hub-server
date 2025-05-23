import { validationError } from "../../../presentation/middlewares/errorMiddleWare";
import {
  AuthStatus,
  SubscriptionStatus,
} from "../../../shared/constants/index-constants";
import { Subscription, TrainerSubscribersList } from "../../../domain/entities/subscription";
import { ISubscriptionRepository } from "../../../domain/interfaces/ISubscriptionRepository";
import { IUserSubscriptionPlanRepository } from "../../../domain/interfaces/IUserSubscriptionRepository";
import {
  GetTrainerSubscribersQueryDTO,
} from "../../dtos/query-dtos";
import { IPaymentService } from "../../interfaces/payments/IPaymentService";
import { IdDTO, PaginationDTO } from "../../dtos/utility-dtos";

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
      throw new validationError(AuthStatus.IdRequired);
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
        AuthStatus.AllFieldsAreRequired
      );
    }
    const { trainerSubscriberRecord, paginationData } =
      await this.userSubscriptionPlanRepository.findSubscriptionsOfTrainer(
        trainerId,
        { page, limit, search, filters }
      );
    if (!trainerSubscriberRecord) {
      throw new validationError(
        SubscriptionStatus.FailedToRetrieveSubscriptionDetails
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
