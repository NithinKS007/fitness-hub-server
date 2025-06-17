import { ISubscription } from "@domain/entities/subscription.entity";
import { IBaseRepository } from "@domain/interfaces/IBaseRepository";

export interface ISubscriptionRepository
  extends IBaseRepository<ISubscription> {
  findAllSubscription(trainerId: string): Promise<ISubscription[]>;
}
