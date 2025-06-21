import { validationError } from "@presentation/middlewares/error.middleware";
import { SubscriptionStatus } from "@shared/constants/index.constants";
import { ISubscriptionRepository } from "@domain/interfaces/ISubscriptionRepository";
import { ITrainerRepository } from "@domain/interfaces/ITrainerRepository";
import { IPaymentService } from "@application/interfaces/payments/IPayment.service";
import {
  PeriodType,
  SubPeriod,
  SubscriptionInterval,
} from "@application/dtos/subscription-dtos";
import { ISubscription } from "@domain/entities/subscription.entity";
import { injectable, inject } from "inversify";
import { TYPES_REPOSITORIES } from "@di/types-repositories";
import { TYPES_SERVICES } from "@di/types-services";

@injectable()
export class CreateSubscriptionUseCase {
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

  async execute(createSubscriptionData: {
    trainerId: string;
    subPeriod: SubPeriod;
    price: number;
    durationInWeeks: number;
    sessionsPerWeek: number;
    totalSessions: number;
  }): Promise<ISubscription> {
    const { trainerId, subPeriod, totalSessions, price } =
      createSubscriptionData;

    const [existingSubscription, trainerData] = await Promise.all([
      await this.subscriptionRepository.findOne({
        trainerId,
        subPeriod,
      }),
      await this.trainerRepository.getTrainerDetailsById(trainerId),
    ]);

    if (existingSubscription) {
      throw new validationError(SubscriptionStatus.AlreadyExists);
    }

    const interval = this.getInterval(subPeriod);
    const intervalCount = this.getIntervalCount(subPeriod);
    const productId = await this.paymentService.addProduct({
      name: `${subPeriod.toUpperCase()} FITNESS PLAN`,
      description: `TRAINER: ${trainerData.fname} ${trainerData.lname}, 
      ${totalSessions} SESSIONS, EMAIL: ${trainerData.email}`,
    });
    const stripePriceId = await this.paymentService.addPrice({
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
