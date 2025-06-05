import { validationError } from "../../../presentation/middlewares/error.middleware";
import { SubscriptionStatus } from "../../../shared/constants/index.constants";
import { Subscription } from "../../../domain/entities/subscription.entities";
import { ISubscriptionRepository } from "../../../domain/interfaces/ISubscriptionRepository";
import { ITrainerRepository } from "../../../domain/interfaces/ITrainerRepository";
import { IPaymentService } from "../../interfaces/payments/IPayment.service";
import {
  PeriodType,
  SubPeriod,
  SubscriptionInterval,
} from "../../dtos/subscription-dtos";

export class CreateSubscriptionUseCase {
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

  async execute(createSubscriptionData: {
    trainerId: string;
    subPeriod: SubPeriod;
    price: number;
    durationInWeeks: number;
    sessionsPerWeek: number;
    totalSessions: number;
  }): Promise<Subscription> {
    const { trainerId, subPeriod, totalSessions, price } =
      createSubscriptionData;
    const existingSubscription = await this.subscriptionRepository.findOne({
      trainerId,
      subPeriod,
    });

    const trainerData = await this.trainerRepository.getTrainerDetailsById(
      trainerId
    );

    if (existingSubscription) {
      throw new validationError(SubscriptionStatus.SubscriptionAlreadyExists);
    }

    const interval = this.getInterval(subPeriod);
    const intervalCount = this.getIntervalCount(subPeriod);
    const productId = await this.paymentService.createProduct({
      name: `${subPeriod.toUpperCase()} FITNESS PLAN`,
      description: `TRAINER: ${trainerData.fname} ${trainerData.lname}, 
      ${totalSessions} SESSIONS, EMAIL: ${trainerData.email}`,
    });
    const stripePriceId = await this.paymentService.createPrice({
      productId,
      amount: price * 100,
      currency: "usd",
      interval,
      intervalCount,
    });
    return await this.subscriptionRepository.create({
      ...createSubscriptionData,
      stripePriceId: stripePriceId,
    });
  }
}
