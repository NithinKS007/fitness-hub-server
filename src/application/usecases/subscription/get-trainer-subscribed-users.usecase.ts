import { validationError } from "@presentation/middlewares/error.middleware";
import {
  ApplicationStatus,
  SubscriptionStatus,
} from "@shared/constants/index.constants";
import { IUserSubscriptionPlanRepository } from "@domain/interfaces/IUserSubscriptionPlanRepository";
import { GetTrainerSubsDTO } from "@application/dtos/query-dtos";
import { IPaymentService } from "@application/interfaces/services/payments/IPayment.service";
import { PaginationDTO } from "@application/dtos/utility-dtos";
import { TrainerSubList } from "@application/dtos/subscription-dtos";
import { injectable, inject } from "inversify";
import { TYPES_SERVICES } from "@di/types-services";
import { TYPES_REPOSITORIES } from "@di/types-repositories";
import { IGetTrainerSubscribersUC } from "@application/interfaces/usecases/ISubscriptionUC";

@injectable()
export class GetTrainerSubscribersUseCase implements IGetTrainerSubscribersUC {
  constructor(
    @inject(TYPES_REPOSITORIES.UserSubscriptionPlanRepository)
    private userSubscriptionPlanRepository: IUserSubscriptionPlanRepository,
    @inject(TYPES_SERVICES.PaymentService)
    private paymentService: IPaymentService
  ) {}
  async execute({
    trainerId,
    page,
    limit,
    search,
    filters,
  }: GetTrainerSubsDTO): Promise<{
    trainerSubscribers: TrainerSubList[];
    paginationData: PaginationDTO;
  }> {
    if (!trainerId) {
      throw new validationError(ApplicationStatus.AllFieldsAreRequired);
    }
    const query = { trainerId, page, limit, search, filters };
    const { data: trainerSubscriberRecord, pagination: paginationData } =
      await this.userSubscriptionPlanRepository.getTrainerSubscriptions(query);
    if (!trainerSubscriberRecord) {
      throw new validationError(SubscriptionStatus.NotFound);
    }

    const trainerSubscribers = await Promise.all(
      trainerSubscriberRecord.map(async (sub) => {
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

    return { trainerSubscribers: trainerSubscribers, paginationData };
  }
}
