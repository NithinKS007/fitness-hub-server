import { SubPeriod } from "../../../infrastructure/databases/models/subscription.model";
import { validationError } from "../../../presentation/middlewares/error.middleware";
import { SubscriptionStatus } from "../../../shared/constants/index.constants";
import { Subscription } from "../../../domain/entities/subscription.entities";
import { ISubscriptionRepository } from "../../../domain/interfaces/ISubscriptionRepository";
import { ITrainerRepository } from "../../../domain/interfaces/ITrainerRepository";
import { IPaymentService } from "../../interfaces/payments/IPayment.service";

export class CreateSubscriptionUseCase {
  constructor(
    private subscriptionRepository: ISubscriptionRepository,
    private trainerRepository: ITrainerRepository,
    private paymentService: IPaymentService
  ) {}
  private getInterval(subPeriod: SubPeriod): "month" | "year" {
    return subPeriod === "yearly" ? "year" : "month";
  }
  private getIntervalCount = (subPeriod: SubPeriod): number => {
    if (subPeriod === "quarterly") {
      return 3;
    } else if (subPeriod === "halfYearly") {
      return 6;
    } else if (subPeriod === "yearly") {
      return 1;
    } else {
      return 1;
    }
  };

  async createSubscription(createSubscriptionData: {
    trainerId: string;
    subPeriod: SubPeriod;
    price: number;
    durationInWeeks: number;
    sessionsPerWeek: number;
    totalSessions: number;
  }): Promise<Subscription> {
    const { trainerId, subPeriod, totalSessions, price } =
      createSubscriptionData;
    const existing = await this.subscriptionRepository.findExistingSubscription(
      { trainerId, subPeriod }
    );

    const trainerData = await this.trainerRepository.getTrainerDetailsById(
      trainerId
    );

    if (existing) {
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
    return await this.subscriptionRepository.createSubscription({
      ...createSubscriptionData,
      stripePriceId: stripePriceId,
    });
  }
}
