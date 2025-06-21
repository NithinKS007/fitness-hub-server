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
import { injectable, inject } from "inversify";
import { TYPES_REPOSITORIES } from "@di/types-repositories";
import { TYPES_SERVICES } from "@di/types-services";

@injectable()
export class GetUserSubscriptionUseCase {
  constructor(
    @inject(TYPES_REPOSITORIES.UserSubscriptionPlanRepository)
    private userSubscriptionPlanRepository: IUserSubscriptionPlanRepository,
    @inject(TYPES_SERVICES.PaymentService)
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
      throw new validationError(SubscriptionStatus.NotFound);
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
