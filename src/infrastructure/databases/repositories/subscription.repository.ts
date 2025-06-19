import { Model } from "mongoose";
import { ISubscriptionRepository } from "@domain/interfaces/ISubscriptionRepository";
import SubscriptionModel from "@infrastructure/databases/models/subscription.model";
import { BaseRepository } from "@infrastructure/databases/repositories/base.repository";
import { ISubscription } from "@domain/entities/subscription.entity";

export class SubscriptionRepository
  extends BaseRepository<ISubscription>
  implements ISubscriptionRepository
{
  constructor(
    model: Model<ISubscription> = SubscriptionModel
  ) {
    super(model);
  }
  async findAllSubscription(trainerId: string): Promise<ISubscription[]> {
    return await this.model
      .find({ trainerId: trainerId })
      .sort({ createdAt: -1 })
      .lean();
  }
}
