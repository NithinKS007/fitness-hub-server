import { FindExistingSubscriptionDTO } from "../../application/dtos/subscription-dtos";
import { ISubscription } from "../../infrastructure/databases/models/subscription.model";
import { Subscription } from "../entities/subscription.entities";
import { IBaseRepository } from "./IBaseRepository";

export interface ISubscriptionRepository
  extends IBaseRepository<ISubscription> {
  findAllSubscription(trainerId: string): Promise<Subscription[]>;
}
