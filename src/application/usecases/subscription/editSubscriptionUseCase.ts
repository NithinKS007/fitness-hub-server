import { UpdateSubscriptionDetailsDTO } from "../../dtos/subscription-dtos";
import { validationError } from "../../../presentation/middlewares/errorMiddleWare";
import {
  AuthStatus,
  SubscriptionStatus,
} from "../../../shared/constants/index-constants";
import { Subscription } from "../../../domain/entities/subscription";
import { SubPeriod } from "../../../infrastructure/databases/models/subscriptionModel";
import { ISubscriptionRepository } from "../../../domain/interfaces/ISubscriptionRepository";
import { ITrainerRepository } from "../../../domain/interfaces/ITrainerRepository";
import { IPaymentService } from "../../interfaces/payments/IPaymentService";

export class EditSubscriptionUseCase {
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
  public async editSubscription({
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
      throw new validationError(
        AuthStatus.AllFieldsAreRequired
      );
    }

    const existingSubData =
      await this.subscriptionRepository.findSubscriptionById(subscriptionId);

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
      updatedSubscriptionData =
        await this.subscriptionRepository.editSubscription({
          ...{
            subscriptionId,
            durationInWeeks,
            price,
            sessionsPerWeek,
            stripePriceId,
            subPeriod,
            totalSessions,
            trainerId,
          },
          stripePriceId: stripePriceId,
        });
    }

    updatedSubscriptionData =
      await this.subscriptionRepository.editSubscription({
        ...{
          subscriptionId,
          durationInWeeks,
          price,
          sessionsPerWeek,
          stripePriceId: existingSubData?.stripePriceId,
          subPeriod,
          totalSessions,
          trainerId,
        },
      });
    if (!updatedSubscriptionData) {
      throw new validationError(SubscriptionStatus.FailedToEditSubscription);
    }
    return updatedSubscriptionData;
  }
}
