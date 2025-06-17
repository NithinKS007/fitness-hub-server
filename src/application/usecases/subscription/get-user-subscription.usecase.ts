import { validationError } from "@presentation/middlewares/error.middleware";
import {
  ApplicationStatus,
  SubscriptionStatus,
} from "@shared/constants/index.constants";
import { IUserSubscriptionPlanRepository } from "@domain/interfaces/IUserSubscriptionPlanRepository";
import { GetUserSubscriptionsQueryDTO } from "@application/dtos/query-dtos";
import { IPaymentService } from "@application/interfaces/payments/IPayment.service";
import { PaginationDTO } from "@application/dtos/utility-dtos";
import { UserSubscriptionsList } from "@application/dtos/subscription-dtos";

export class GetUserSubscriptionUseCase {
  constructor(
    private userSubscriptionPlanRepository: IUserSubscriptionPlanRepository,
    private paymentService: IPaymentService
  ) {}

  async execute(
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
      await this.userSubscriptionPlanRepository.getUserSubscriptions(
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
}
