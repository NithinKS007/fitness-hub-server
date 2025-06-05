import {
  PeriodType,
  SubPeriod,
  SubscriptionInterval,
  UpdateSubscriptionDetailsDTO,
} from "../../dtos/subscription-dtos";
import { validationError } from "../../../presentation/middlewares/error.middleware";
import {
  ApplicationStatus,
  AuthStatus,
  SubscriptionStatus,
} from "../../../shared/constants/index.constants";
import { Subscription } from "../../../domain/entities/subscription.entities";
import { ISubscriptionRepository } from "../../../domain/interfaces/ISubscriptionRepository";
import { ITrainerRepository } from "../../../domain/interfaces/ITrainerRepository";
import { IPaymentService } from "../../interfaces/payments/IPayment.service";

export class EditSubscriptionUseCase {
  constructor(
    private subscriptionRepository: ISubscriptionRepository,
    private trainerRepository: ITrainerRepository,
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
  }: UpdateSubscriptionDetailsDTO): Promise<Subscription> {
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
      const productId = await this.paymentService.createProduct({
        name: `${subPeriod.toUpperCase()} FITNESS PLAN`,
        description: `TRAINER: ${trainerData?.fname} ${trainerData?.lname},
        ${totalSessions} SESSIONS, EMAIL: ${trainerData?.email}`,
      });

      const interval = this.getInterval(subPeriod);
      const intervalCount = this.getIntervalCount(subPeriod);
      const stripePriceId = await this.paymentService.createPrice({
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
      throw new validationError(SubscriptionStatus.FailedToEditSubscription);
    }
    return updatedSubscriptionData;
  }
}
