import { validationError } from "@presentation/middlewares/error.middleware";
import {
  ApplicationStatus,
  SubscriptionStatus,
} from "@shared/constants/index.constants";
import { IUserSubscriptionPlanRepository } from "@domain/interfaces/IUserSubscriptionPlanRepository";
import { GetUserSubDTO } from "@application/dtos/query-dtos";
import { IPaymentService } from "@application/interfaces/services/payments/IPayment.service";
import { PaginationDTO } from "@application/dtos/utility-dtos";
import { injectable, inject } from "inversify";
import { TYPES_REPOSITORIES } from "@di/types-repositories";
import { TYPES_SERVICES } from "@di/types-services";
import { IGetUserSubscriptionsUC } from "@application/interfaces/usecases/ISubscriptionUC";
import { UserSubList } from "@application/dtos/subscription-dtos";

@injectable()
export class GetUserSubscriptionUseCase implements IGetUserSubscriptionsUC {
  constructor(
    @inject(TYPES_REPOSITORIES.UserSubscriptionPlanRepository)
    private userSubscriptionPlanRepository: IUserSubscriptionPlanRepository,
    @inject(TYPES_SERVICES.PaymentService)
    private paymentService: IPaymentService
  ) {}

  async execute({ userId, page, limit, search, filters }: GetUserSubDTO): Promise<{
    userSubscriptionsList: UserSubList[];
    paginationData: PaginationDTO;
  }> {
    if (!userId) {
      throw new validationError(ApplicationStatus.AllFieldsAreRequired);
    }
    const query = { userId, page, limit, search, filters };
    const { data: userSubscriptionRecord, pagination: paginationData } =
      await this.userSubscriptionPlanRepository.getUserSubscriptions(query);
    if (!userSubscriptionRecord) {
      throw new validationError(SubscriptionStatus.NotFound);
    }

    const userSubscriptionsList = await Promise.all(
      userSubscriptionRecord.map(async (sub) => {
        const currentSub = await this.paymentService.getSubscriptionById({
          providerSubId: sub.providerSubId,
        });
        return {
          ...sub,
          ...{
            startDate: new Date(currentSub.current_period_start * 1000)
              .toISOString()
              .split("T")[0],
          },
          endDate: new Date(currentSub.current_period_end * 1000)
            .toISOString()
            .split("T")[0],
          serviceSubStatus: currentSub.status,
        };
      })
    );
    return {
      userSubscriptionsList: userSubscriptionsList,
      paginationData: paginationData,
    };
  }
}
