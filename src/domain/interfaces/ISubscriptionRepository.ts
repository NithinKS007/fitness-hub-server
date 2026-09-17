import { Subscription } from "@domain/entities/subscription.entity";
import { IBaseRepository } from "@domain/interfaces/IBaseRepository";
import { ISubscription } from "@infrastructure/databases/models/subscription.model";

export interface ISubscriptionRepository
  extends IBaseRepository<ISubscription, Subscription> {
  findAllSubscription(trainerId: string): Promise<Subscription[]>;
}
