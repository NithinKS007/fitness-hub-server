import { CreateSubscriptionDTO, findExistingSubscriptionDTO, IdDTO } from "../../application/dtos";
import { Subscription } from "../entities/subscriptionEntity";

export interface subscriptionRepository {
  createSubscription(data: CreateSubscriptionDTO): Promise<Subscription>;
  findAllSubscription(data:IdDTO):Promise<Subscription[]>
  findExistingSubscription(data:findExistingSubscriptionDTO):Promise<boolean>
}
