import {
  PeriodType,
  SubPeriod,
  SubscriptionInterval,
  UpdateSubscriptionDetailsDTO,
} from "@application/dtos/subscription-dtos";
import { validationError } from "@presentation/middlewares/error.middleware";
import {
  ApplicationStatus,
  AuthStatus,
  SubscriptionStatus,
} from "@shared/constants/index.constants";
import { ISubscriptionRepository } from "@domain/interfaces/ISubscriptionRepository";
import { ITrainerRepository } from "@domain/interfaces/ITrainerRepository";
import { IPaymentService } from "@application/interfaces/payments/IPayment.service";
import { ISubscription } from "@domain/entities/subscription.entity";
import { injectable, inject } from "inversify";
import { TYPES_SERVICES } from "@di/types-services";
import { TYPES_REPOSITORIES } from "@di/types-repositories";

@injectable()
export class EditSubscriptionUseCase {
  constructor(
    @inject(TYPES_REPOSITORIES.SubscriptionRepository)
    private subscriptionRepository: ISubscriptionRepository,
    @inject(TYPES_REPOSITORIES.TrainerRepository)
    private trainerRepository: ITrainerRepository,
    @inject(TYPES_SERVICES.PaymentService)
    private paymentService: IPaymentService
  ) {}

  private getInterval(subPeriod: SubPeriod): SubscriptionInterval {
    return subPeriod === PeriodType.Yearly
      ? SubscriptionInterval.Year
      : SubscriptionInterval.Month;
  }
  private getIntervalCount = (subPeriod: SubPeriod): number => {
    switch (subPeriod) {
      case PeriodType.Quarterly:
        return 3;
      case PeriodType.HalfYearly:
        return 6;
      case PeriodType.Yearly:
        return 1;
      default:
        return 1;
    }
  };
  async execute({
    subscriptionId,
    durationInWeeks,
    price,
    sessionsPerWeek,
    subPeriod,
    totalSessions,
    trainerId,
  }: UpdateSubscriptionDetailsDTO): Promise<ISubscription> {
    if (
      !subscriptionId ||
      !durationInWeeks ||
      !price ||
      !sessionsPerWeek ||
      !subPeriod ||
      !totalSessions ||
      !trainerId
    ) {
      throw new validationError(ApplicationStatus.AllFieldsAreRequired);
    }

    const existingSubData = await this.subscriptionRepository.findById(
      subscriptionId
    );

    if (!existingSubData) {
      throw new validationError(AuthStatus.InvalidId);
    }

    const trainerData = await this.trainerRepository.getTrainerDetailsById(
      trainerId
    );

    let updatedSubscriptionData;
    if (
      subPeriod !== existingSubData?.subPeriod ||
      price !== existingSubData?.price ||
      totalSessions !== existingSubData?.totalSessions
    ) {
      const productId = await this.paymentService.addProduct({
        name: `${subPeriod.toUpperCase()} FITNESS PLAN`,
        description: `TRAINER: ${trainerData?.fname} ${trainerData?.lname},
        ${totalSessions} SESSIONS, EMAIL: ${trainerData?.email}`,
      });

      const interval = this.getInterval(subPeriod);
      const intervalCount = this.getIntervalCount(subPeriod);
      const stripePriceId = await this.paymentService.addPrice({
        productId,
        amount: price * 100,
        currency: "usd",
        interval,
        intervalCount,
      });
      updatedSubscriptionData = await this.subscriptionRepository.update(
        subscriptionId,
        {
          durationInWeeks,
          price,
          sessionsPerWeek,
          stripePriceId,
          subPeriod,
          totalSessions,
          trainerId,
        }
      );
    }

    updatedSubscriptionData = await this.subscriptionRepository.update(
      subscriptionId,
      {
        durationInWeeks,
        price,
        sessionsPerWeek,
        stripePriceId: existingSubData?.stripePriceId,
        subPeriod,
        totalSessions,
        trainerId,
      }
    );
    if (!updatedSubscriptionData) {
      throw new validationError(SubscriptionStatus.EditFailed);
    }
    return updatedSubscriptionData;
  }
}
