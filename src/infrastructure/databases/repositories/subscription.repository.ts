import { Model } from "mongoose";
import { ISubscriptionRepository } from "@domain/interfaces/ISubscriptionRepository";
import SubscriptionModel, {
  ISubscription,
} from "@infrastructure/databases/models/subscription.model";
import { BaseRepository } from "@infrastructure/databases/repositories/base.repository";
import { Subscription } from "@domain/entities/subscription.entity";

export class SubscriptionRepository
  extends BaseRepository<ISubscription, Subscription>
  implements ISubscriptionRepository
{
  constructor(model: Model<ISubscription> = SubscriptionModel) {
    super(
      model,
      "_id trainerId subPeriod price durationInWeeks sessionsPerWeek totalSessions isBlocked providerPriceId createdAt updatedAt"
    );
  }
  public findAll = async (query: Partial<Subscription>): Promise<Subscription[]> => {
    const result = await this.model
      .find({ trainerId: query.trainerId })
      .select(
        "_id trainerId subPeriod price durationInWeeks sessionsPerWeek totalSessions isBlocked providerPriceId createdAt updatedAt"
      )
      .sort({ createdAt: -1 });

    return result.map((s) => this.toDomain(s));
  };
}
