import { Subscription } from "@domain/entities/subscription.entity";
import { IBaseRepository } from "@domain/interfaces/IBaseRepository";

export interface ISubscriptionRepository
  extends IBaseRepository<Subscription> {
  findAll(query: Partial<Subscription>): Promise<Subscription[]>;
}
