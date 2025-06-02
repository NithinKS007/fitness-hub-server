import { validationError } from "../../../presentation/middlewares/error.middleware";
import {
  ApplicationStatus,
  SubscriptionStatus,
} from "../../../shared/constants/index.constants";
import {
  UserMyTrainersList,
  UserSubscriptionsList,
} from "../../../domain/entities/subscription.entities";
import { IUserSubscriptionPlanRepository } from "../../../domain/interfaces/IUserSubscriptionRepository";
import {
  GetUserSubscriptionsQueryDTO,
  GetUserTrainersListQueryDTO,
} from "../../dtos/query-dtos";
import { IPaymentService } from "../../interfaces/payments/IPayment.service";
import { PaginationDTO } from "../../dtos/utility-dtos";

export class GetUserSubscriptionUseCase {
  constructor(
    private userSubscriptionPlanRepository: IUserSubscriptionPlanRepository,
    private paymentService: IPaymentService
  ) {}

  async getUserSubscriptionsData(
    userId: string,
    { page, limit, search, filters }: GetUserSubscriptionsQueryDTO
  ): Promise<{
    userSubscriptionsList: UserSubscriptionsList[];
    paginationData: PaginationDTO;
  }> {
    if (!userId) {
      throw new validationError(ApplicationStatus.AllFieldsAreRequired);
    }
    const query = { page, limit, search, filters };
    const { userSubscriptionRecord, paginationData } =
      await this.userSubscriptionPlanRepository.findSubscriptionsOfUser(
        userId,
        query
      );
    if (!userSubscriptionRecord) {
      throw new validationError(
        SubscriptionStatus.FailedToRetrieveSubscriptionDetails
      );
    }

    const userSubscriptionsList = await Promise.all(
      userSubscriptionRecord.map(async (sub) => {
        const stripeData = await this.paymentService.getSubscriptionsData(
          sub.stripeSubscriptionId
        );
        return {
          ...sub,
          ...stripeData,
        };
      })
    );
    return {
      userSubscriptionsList: userSubscriptionsList,
      paginationData: paginationData,
    };
  }

  async userMyTrainersList(
    userId: string,
    { page, limit, search }: GetUserTrainersListQueryDTO
  ): Promise<{
    userTrainersList: UserMyTrainersList[];
    paginationData: PaginationDTO;
  }> {
    const query = { page, limit, search };
    const { userTrainersList, paginationData } =
      await this.userSubscriptionPlanRepository.usersMyTrainersList(
        userId,
        query
      );
    if (!userTrainersList) {
      throw new validationError("Failed to retrieve user trainers list");
    }
    return {
      userTrainersList: userTrainersList,
      paginationData: paginationData,
    };
  }
}
