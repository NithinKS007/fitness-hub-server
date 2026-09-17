import { CheckSubscriptionStatusDTO } from "@application/dtos/subscription-dtos";
import { validationError } from "@presentation/middlewares/error.middleware";
import { ApplicationStatus } from "@shared/constants/index.constants";
import { IUserSubscriptionPlanRepository } from "@domain/interfaces/IUserSubscriptionPlanRepository";
import { IPaymentService } from "@application/interfaces/services/payments/IPayment.service";
import { injectable, inject } from "inversify";
import { TYPES_REPOSITORIES } from "@di/types-repositories";
import { TYPES_SERVICES } from "@di/types-services";
import { ICheckSubscriptionStatusUC } from "@application/interfaces/usecases/ISubscriptionUC";

@injectable()
export class CheckSubscriptionStatusUseCase implements ICheckSubscriptionStatusUC {
  constructor(
    @inject(TYPES_REPOSITORIES.UserSubscriptionPlanRepository)
    private userSubscriptionPlanRepository: IUserSubscriptionPlanRepository,
    @inject(TYPES_SERVICES.PaymentService)
    private paymentService: IPaymentService
  ) {}

  async execute({ userId, trainerId }: CheckSubscriptionStatusDTO): Promise<{
    trainerId: string;
    isSubscribed: boolean;
  }> {
    if (!userId || !trainerId) {
      throw new validationError(ApplicationStatus.AllFieldsAreRequired);
    }

    const currentsubPlanData =
      await this.userSubscriptionPlanRepository.getLatestPlan({
        userId,
        trainerId,
      });

    if (!currentsubPlanData) {
      return {
        trainerId,
        isSubscribed: false,
      };
    }

    const currentSubscription = await this.paymentService.getSubscriptionById({
      providerSubId: currentsubPlanData.providerSubId,
    });

    if (!currentSubscription) {
      return {
        trainerId,
        isSubscribed: false,
      };
    }

    if (
      currentSubscription &&
      currentsubPlanData &&
      currentsubPlanData.providerSubStatus === "active" &&
      currentSubscription.status === "active"
    ) {
      return {
        trainerId: trainerId,
        isSubscribed: true,
      };
    }

    return {
      trainerId: trainerId,
      isSubscribed: false,
    };
  }
}
