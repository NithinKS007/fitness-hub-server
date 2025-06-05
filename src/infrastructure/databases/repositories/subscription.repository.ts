import { Model } from "mongoose";
import { Subscription } from "../../../domain/entities/subscription.entities";
import { ISubscriptionRepository } from "../../../domain/interfaces/ISubscriptionRepository";
import SubscriptionModel, { ISubscription } from "../models/subscription.model";
import { BaseRepository } from "./base.repository";

export class SubscriptionRepository
  extends BaseRepository<ISubscription>
  implements ISubscriptionRepository
{
  constructor(model: Model<ISubscription> = SubscriptionModel) {
    super(model);
  }
  async findAllSubscription(trainerId: string): Promise<Subscription[]> {
    return await this.model
      .find({ trainerId: trainerId })
      .sort({ createdAt: -1 })
      .lean();
  }
}
