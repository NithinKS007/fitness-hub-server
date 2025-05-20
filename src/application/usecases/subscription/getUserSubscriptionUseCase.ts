import { validationError } from "../../../presentation/middlewares/errorMiddleWare";
import {
  AuthenticationStatusMessage,
  SubscriptionStatusMessage,
} from "../../../shared/constants/httpResponseStructure";
import { UserMyTrainersList, UserSubscriptionsList } from "../../../domain/entities/subscription";
import { IUserSubscriptionPlanRepository } from "../../../domain/interfaces/IUserSubscriptionRepository";
import {
  GetUserSubscriptionsQueryDTO,
  GetUserTrainersListQueryDTO,
} from "../../dtos/query-dtos";
import { IPaymentService } from "../../interfaces/payments/IPaymentService";
import { IdDTO, PaginationDTO } from "../../dtos/utility-dtos";

export class GetUserSubscriptionUseCase {
  constructor(
    private userSubscriptionPlanRepository: IUserSubscriptionPlanRepository,
    private paymentService: IPaymentService
  ) {}

  public async getUserSubscriptionsData(
    userId: IdDTO,
    { page, limit, search, filters }: GetUserSubscriptionsQueryDTO
  ): Promise<{
    userSubscriptionsList: UserSubscriptionsList[];
    paginationData: PaginationDTO;
  }> {
    if (!userId) {
      throw new validationError(
        AuthenticationStatusMessage.AllFieldsAreRequired
      );
    }

    const { userSubscriptionRecord, paginationData } =
      await this.userSubscriptionPlanRepository.findSubscriptionsOfUser(
        userId,
        { page, limit, search, filters }
      );
    if (!userSubscriptionRecord) {
      throw new validationError(
        SubscriptionStatusMessage.FailedToRetrieveSubscriptionDetails
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

  public async userMyTrainersList(
    userId: IdDTO,
    { page, limit, search }: GetUserTrainersListQueryDTO
  ): Promise<{
    userTrainersList: UserMyTrainersList[];
    paginationData: PaginationDTO;
  }> {
    const { userTrainersList, paginationData } =
      await this.userSubscriptionPlanRepository.usersMyTrainersList(userId, {
        page,
        limit,
        search,
      });
    if (!userTrainersList) {
      throw new validationError("Failed to retrieve user trainers list");
    }
    return {
      userTrainersList: userTrainersList,
      paginationData: paginationData,
    };
  }
}
