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
    super(model);
  }
  async findAllSubscription(trainerId: string): Promise<Subscription[]> {
    const result = await this.model
      .find({ trainerId: trainerId })
      .sort({ createdAt: -1 })

    return result.map((s) => this.toDomain(s));
  }
}
